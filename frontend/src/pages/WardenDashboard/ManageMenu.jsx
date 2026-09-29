import { useState, useEffect } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { Save, UtensilsCrossed } from "lucide-react";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const MEALS = ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"];
const MEAL_ICONS = { BREAKFAST: "🍳", LUNCH: "🍛", SNACKS: "🍪", DINNER: "🍽️" };
const MEAL_TIMES = { BREAKFAST: "8:00 AM", LUNCH: "1:00 PM", SNACKS: "4:30 PM", DINNER: "8:30 PM" };

export default function ManageMenu() {
  const [existingMenu, setExistingMenu] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [selectedDay, setSelectedDay] = useState("MONDAY");
  const [meals, setMeals] = useState({
    BREAKFAST: "",
    LUNCH: "",
    SNACKS: "",
    DINNER: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  // when day changes, populate inputs with existing data
  useEffect(() => {
    if (existingMenu?.meals?.[selectedDay]) {
      const dayMeals = existingMenu.meals[selectedDay];
      setMeals({
        BREAKFAST: dayMeals.BREAKFAST?.join(", ") || "",
        LUNCH: dayMeals.LUNCH?.join(", ") || "",
        SNACKS: dayMeals.SNACKS?.join(", ") || "",
        DINNER: dayMeals.DINNER?.join(", ") || "",
      });
    } else {
      setMeals({ BREAKFAST: "", LUNCH: "", SNACKS: "", DINNER: "" });
    }
  }, [selectedDay, existingMenu]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/menu");
      if (res.data.length > 0) {
        setExistingMenu(res.data[0]);
        setMenuId(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    setSuccessMsg("");
    setError("");

    // convert comma-separated strings to arrays
    const dayMeals = {};
    MEALS.forEach((meal) => {
      dayMeals[meal] = meals[meal]
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    });

    try {
      if (menuId) {
        // update existing menu — merge this day into existing meals
        const updatedMeals = {
          ...existingMenu.meals,
          [selectedDay]: dayMeals,
        };
        await api.put(`/api/menu/${menuId}`, { meals: updatedMeals });
        setExistingMenu((prev) => ({
          ...prev,
          meals: updatedMeals,
        }));
      } else {
        // create new menu with just this day
        const res = await api.post("/api/menu", {
          meals: { [selectedDay]: dayMeals },
        });
        setMenuId(res.data._id);
        setExistingMenu(res.data);
      }
      setSuccessMsg(`${selectedDay} menu saved successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to save menu. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-[#f8f9ff] dark:bg-[#0F1F2E] min-h-screen">
      <PageHeader title="Manage Mess Menu" />

     <div className="max-w-2xl mx-auto w-full">
        {/* Day selector */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm mb-5">
         <label className="block text-sm font-medium text-[#083067] dark:text-white mb-2.5">
            Select Day
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#3B5368] bg-gray-50 dark:bg-[#243B50] text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          >
            {DAYS.map((day) => (
              <option key={day} value={day} className="bg-white dark:bg-[#243B50] text-gray-900 dark:text-white">
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Meal inputs */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-5">
            <UtensilsCrossed className="w-4 h-4 text-[#083067] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#083067] dark:text-white">
              {selectedDay.charAt(0) + selectedDay.slice(1).toLowerCase()} Meals
            </h2>
          </div>

          <div className="space-y-4 lg:space-y-5">
            {MEALS.map((meal) => (
              <div key={meal}>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  <span>{MEAL_ICONS[meal]}</span>
                  {meal.charAt(0) + meal.slice(1).toLowerCase()}
                  <span className="text-gray-300 dark:text-gray-600">
                    · {MEAL_TIMES[meal]}
                  </span>
                </label>
                <input
                  type="text"
                  value={meals[meal]}
                  onChange={(e) =>
                    setMeals((prev) => ({ ...prev, [meal]: e.target.value }))
                  }
                  placeholder="e.g. Dal, Rice, Roti, Salad"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-white/5 text-sm text-[#083067] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#083067]/20 placeholder-gray-300 dark:placeholder-gray-600"
                />
                <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">
                  Separate items with commas
                </p>
              </div>
            ))}
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-sm px-4 py-3 rounded-xl mb-4">
            ✓ {successMsg}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={submitting}
          className="w-full py-3 lg:py-3.5 bg-[#083067] hover:bg-[#0a3d80] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {submitting ? "Saving..." : `Save ${selectedDay.charAt(0) + selectedDay.slice(1).toLowerCase()} Menu`}
        </button>
      </div>
    </div>
  );
}