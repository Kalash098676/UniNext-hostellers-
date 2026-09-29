require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Preference = require("../models/Preference");
const RoommateMatch = require("../models/RoommateMatch");
const Room = require("../models/Room");

const firstNamesMale = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Shaurya", "Atharva", "Advik", "Pranav", "Adhiraj", "Ketan", "Rohan", "Siddharth", "Kabir", "Devansh",
  "Yash", "Dhruv", "Harsh", "Karan", "Madhav", "Manish", "Nikhil", "Om", "Parth", "Rahul",
  "Ritik", "Sahil", "Sameer", "Shivam", "Tanishq", "Utkarsh", "Varun", "Vikram", "Abhinav", "Aniket",
  "Bhavya", "Chaitanya", "Deepak", "Gautam", "Himanshu", "Jatin", "Kunal", "Lalit", "Mayank", "Nitin"
];

const firstNamesFemale = [
  "Ananya", "Aadhya", "Saanvi", "Priya", "Diya", "Riya", "Avani", "Isha", "Kavya", "Myra",
  "Anushka", "Nisha", "Pooja", "Roshni", "Shruti", "Tanvi", "Urvi", "Vaishnavi", "Yashvi", "Zoya",
  "Aditi", "Bhavna", "Charu", "Divya", "Ekta", "Gauri", "Heena", "Juhi", "Kirti", "Lavanya",
  "Meera", "Neha", "Payal", "Radhika", "Sneha", "Tara", "Vanya", "Yamini", "Ankita", "Deepika"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Mehta", "Singh", "Das", "Nair", "Iyer", "Patel", "Reddy",
  "Joshi", "Kumar", "Chawla", "Bhatia", "Malhotra", "Saxena", "Kapoor", "Mishra", "Pandey", "Rao",
  "Deshmukh", "Agarwal", "Bansal", "Chaudhary", "Dutta", "Gill", "Hegde", "Jain", "Kulkarni", "Mahajan"
];

const branches = [
  "Computer Science", "Information Technology", "Electronics & Comm.", "Electrical Engg.", "Mechanical Engg.", "Civil Engg."
];

async function generate50Matches() {
  try {
    await connectDB();
    console.log("Connected to database. Starting 50 Roommate Matches seeding...");

    const defaultPassword = await bcrypt.hash("Student@123", 10);

    // Clear existing matches to avoid duplicates
    await RoommateMatch.deleteMany({});
    console.log("Cleared existing matches.");

    const createdMatches = [];

    for (let i = 1; i <= 50; i++) {
      const isBoys = i <= 30; // 30 boys matches, 20 girls matches
      const hostelType = isBoys ? "BOYS_HOSTEL" : "GIRLS_HOSTEL";
      const roomType = i % 4 === 0 ? "THREE" : "TWO"; // Mostly 2-seater, some 3-seater
      const groupSize = roomType === "THREE" ? 3 : 2;

      const studentDocs = [];

      for (let j = 1; j <= groupSize; j++) {
        const fnList = isBoys ? firstNamesMale : firstNamesFemale;
        const firstName = fnList[(i * groupSize + j) % fnList.length];
        const lastName = lastNames[(i * 3 + j * 7) % lastNames.length];
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}${j}@uninest.com`;

        let u = await User.findOne({ email });
        if (!u) {
          u = await User.create({
            name: fullName,
            email: email,
            password: defaultPassword,
            role: "ROLE_STUDENT",
            contactNo: `987${Math.floor(1000000 + Math.random() * 9000000)}`,
          });
        }
        studentDocs.push(u);

        const roomNum = isBoys ? `${100 + i}` : `${200 + i}`;

        await StudentProfile.findOneAndUpdate(
          { userId: u._id },
          {
            userId: u._id,
            branch: branches[i % branches.length],
            year: (i % 4) + 1,
            gender: isBoys ? "MALE" : "FEMALE",
            hostelType: hostelType,
            roomId: roomNum,
            parentContactNo: `981${Math.floor(1000000 + Math.random() * 9000000)}`,
            profileComplete: true,
          },
          { upsert: true }
        );

        await Preference.findOneAndUpdate(
          { userId: u._id },
          {
            userId: u._id,
            scheduleType: i % 2 === 0 ? "NIGHT_PERSON" : "MORNING_PERSON",
            cleanlinessLevel: "HIGH",
            noisePreference: "QUIET",
            studyPreference: "ALONE",
            allergy: "NONE",
            roomTempPreference: "COOL",
            roomType: roomType,
          },
          { upsert: true }
        );
      }

      const assignedRoomNum = isBoys ? `${100 + i}` : `${200 + i}`;
      const blockName = isBoys ? (i <= 15 ? "A" : "B") : "C";

      // Also ensure Room exists
      await Room.findOneAndUpdate(
        { roomNumber: assignedRoomNum },
        {
          roomNumber: assignedRoomNum,
          block: blockName,
          floor: Math.ceil(i / 10),
          capacity: groupSize,
          occupiedBeds: groupSize,
          hostelType: hostelType,
          status: "FULL",
        },
        { upsert: true }
      );

      // Compatibility score between 85 and 99
      const compatScore = 85 + Math.floor(Math.random() * 15);
      const isConfirmed = i <= 45; // 45 confirmed, 5 complete awaiting confirmation

      const matchDoc = await RoommateMatch.create({
        students: studentDocs.map((s) => s._id),
        hostelType: hostelType,
        roomType: roomType,
        compatibilityScore: compatScore,
        status: isConfirmed ? "CONFIRMED" : "COMPLETE",
        roomId: assignedRoomNum,
      });

      createdMatches.push(matchDoc);
    }

    console.log(`✓ Successfully created and saved ${createdMatches.length} matched roommate groups in MongoDB Atlas!`);
    process.exit(0);
  } catch (err) {
    console.error("Error generating 50 matches:", err);
    process.exit(1);
  }
}

generate50Matches();
