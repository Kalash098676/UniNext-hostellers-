const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Preference = require("../models/Preference");
const RoommateMatch = require("../models/RoommateMatch");

// ── Scoring function ──────────────────────────────────────────
// Takes two preference objects, returns a score 0-100
function calculateCompatibility(prefA, prefB) {
  let score = 0;

  if (prefA.scheduleType === prefB.scheduleType) score += 20;
  if (prefA.cleanlinessLevel === prefB.cleanlinessLevel) score += 20;
  if (prefA.noisePreference === prefB.noisePreference) score += 20;
  if (prefA.studyPreference === prefB.studyPreference) score += 20;
  if (prefA.roomTempPreference === prefB.roomTempPreference) score += 10;

  // allergy check — if neither has allergies, or allergies don't conflict
  const noAllergyConflict =
    prefA.allergy === "NONE" ||
    prefB.allergy === "NONE" ||
    prefA.allergy === prefB.allergy;
  if (noAllergyConflict) score += 10;

  return score;
}

// ── Room type to number ───────────────────────────────────────
const roomTypeToNumber = {
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

// ── POST /api/matching/run ────────────────────────────────────
// Warden triggers this to run the algorithm
router.post("/run", auth, async (req, res) => {
  try {
    // Step 1 — find all students already in a match
    const existingMatches = await RoommateMatch.find({
      status: { $in: ["INCOMPLETE", "COMPLETE", "CONFIRMED"] },
    });

    const alreadyMatchedIds = new Set(
      existingMatches.flatMap((m) => m.students.map((s) => s.toString()))
    );

    // Step 2 — get eligible students
    // Must have: profileComplete, preferences, NOT already matched
    const profiles = await StudentProfile.find({ profileComplete: true });
    const eligibleProfiles = profiles.filter(
      (p) => !alreadyMatchedIds.has(p.userId.toString())
    );

    if (eligibleProfiles.length === 0) {
      return res.json({ message: "No eligible students to match.", created: 0 });
    }

    // Step 3 — get preferences for all eligible students
    const eligibleUserIds = eligibleProfiles.map((p) => p.userId);
    const preferences = await Preference.find({
      userId: { $in: eligibleUserIds },
    });

    // Map userId → preference for quick lookup
    const prefMap = {};
    preferences.forEach((p) => {
      prefMap[p.userId.toString()] = p;
    });

    // Map userId → profile for quick lookup
    const profileMap = {};
    eligibleProfiles.forEach((p) => {
      profileMap[p.userId.toString()] = p;
    });

    // Step 4 — filter to students who have both profile AND preference
    const fullyEligible = eligibleProfiles.filter(
      (p) => prefMap[p.userId.toString()]
    );

    if (fullyEligible.length === 0) {
      return res.json({
        message: "No students with complete profiles and preferences.",
        created: 0,
      });
    }

    // Step 5 — group by hostelType + roomType
    const pools = {};
    fullyEligible.forEach((profile) => {
      const pref = prefMap[profile.userId.toString()];
      const key = `${profile.hostelType}_${pref.roomType}_${profile.year}`;
      if (!pools[key]) pools[key] = [];
      pools[key].push({
        userId: profile.userId.toString(),
        hostelType: profile.hostelType,
        roomType: pref.roomType,
        pref,
      });
    });

    // Step 6 — for each pool, greedily form groups
    const createdMatches = [];
    const usedStudents = new Set();

    for (const key of Object.keys(pools)) {
      const pool = pools[key].filter((s) => !usedStudents.has(s.userId));
      if (pool.length < 2) continue;

      const targetSize = roomTypeToNumber[pool[0].roomType];
      const hostelType = pool[0].hostelType;
      const roomType = pool[0].roomType;

      // Calculate pairwise scores for everyone in this pool
      const pairScores = {};
      for (let i = 0; i < pool.length; i++) {
        for (let j = i + 1; j < pool.length; j++) {
          const idA = pool[i].userId;
          const idB = pool[j].userId;
          const score = calculateCompatibility(pool[i].pref, pool[j].pref);
          pairScores[`${idA}_${idB}`] = score;
          pairScores[`${idB}_${idA}`] = score;
        }
      }

      // Greedy group formation
      const remaining = [...pool];

      while (remaining.length >= 2) {
        // Start with the pair with the highest score
        let bestScore = -1;
        let bestPair = null;

        for (let i = 0; i < remaining.length; i++) {
          for (let j = i + 1; j < remaining.length; j++) {
            const score =
              pairScores[`${remaining[i].userId}_${remaining[j].userId}`] || 0;
            if (score > bestScore) {
              bestScore = score;
              bestPair = [remaining[i], remaining[j]];
            }
          }
        }

        if (!bestPair) break;

        const group = [...bestPair];
        // Remove these two from remaining
        bestPair.forEach((s) => {
          const idx = remaining.findIndex((r) => r.userId === s.userId);
          if (idx !== -1) remaining.splice(idx, 1);
        });

        // Try to fill the group to targetSize
        while (group.length < targetSize && remaining.length > 0) {
          // Find the remaining student with highest avg score vs current group
          let bestCandidate = null;
          let bestAvgScore = -1;

          for (const candidate of remaining) {
            const avgScore =
              group.reduce((sum, member) => {
                return (
                  sum +
                  (pairScores[`${candidate.userId}_${member.userId}`] || 0)
                );
              }, 0) / group.length;

            if (avgScore > bestAvgScore) {
              bestAvgScore = avgScore;
              bestCandidate = candidate;
            }
          }

          if (bestCandidate) {
            group.push(bestCandidate);
            const idx = remaining.findIndex(
              (r) => r.userId === bestCandidate.userId
            );
            if (idx !== -1) remaining.splice(idx, 1);
          } else {
            break;
          }
        }

        // Calculate average compatibility score for the group
        let totalScore = 0;
        let pairs = 0;
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            totalScore +=
              pairScores[`${group[i].userId}_${group[j].userId}`] || 0;
            pairs++;
          }
        }
        const avgScore = pairs > 0 ? Math.round(totalScore / pairs) : 0;

        // Determine status
        const status = group.length >= targetSize ? "COMPLETE" : "INCOMPLETE";

        // Save match
        const match = await RoommateMatch.create({
          students: group.map((s) => s.userId),
          hostelType,
          roomType,
          compatibilityScore: avgScore,
          status,
        });

        createdMatches.push(match);
        group.forEach((s) => usedStudents.add(s.userId));
      }
    }

    res.json({
      message: `Matching complete. ${createdMatches.length} groups created.`,
      created: createdMatches.length,
      matches: createdMatches,
    });
  } catch (error) {
    console.error("Matching error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/matching/all ─────────────────────────────────────
// Warden gets all matches with student details
router.get("/all", auth, async (req, res) => {
  try {
    const matches = await RoommateMatch.find()
      .populate("students", "name email")
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/matching/my ──────────────────────────────────────
// Student gets their own match
router.get("/my", auth, async (req, res) => {
  try {
    const match = await RoommateMatch.findOne({
      students: req.user.id,
    }).populate("students", "name email");

    if (!match) {
      return res.status(200).json(null);
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/matching/:id/add-student ─────────────────────────
// Warden manually adds an unmatched student to an incomplete group
router.put("/:id/add-student", auth, async (req, res) => {
  try {
    const { studentId } = req.body;
    const match = await RoommateMatch.findById(req.params.id);

    if (!match) return res.status(404).json({ message: "Match not found" });

    const targetSize = roomTypeToNumber[match.roomType];
if (match.students.length >= targetSize) {
  return res.status(400).json({ message: "Group is already full" });
}

    // Check student is not already in a match
    const existing = await RoommateMatch.findOne({ students: studentId });
    if (existing)
      return res.status(400).json({ message: "Student already matched" });

    match.students.push(studentId);

    // Check if now complete
   
    if (match.students.length >= targetSize) {
      match.status = "COMPLETE";
    }

    await match.save();

    const updated = await RoommateMatch.findById(match._id).populate(
      "students",
      "name email"
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/matching/:id/assign-room ─────────────────────────
// Warden assigns a room number — updates match + all students' profiles
router.put("/:id/assign-room", auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    const match = await RoommateMatch.findById(req.params.id);

    if (!match) return res.status(404).json({ message: "Match not found" });

    match.roomId = roomId;
    match.status = "CONFIRMED";
    await match.save();

    // Write roomId to every matched student's profile
    await StudentProfile.updateMany(
      { userId: { $in: match.students } },
      { roomId }
    );

    const updated = await RoommateMatch.findById(match._id).populate(
      "students",
      "name email"
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;