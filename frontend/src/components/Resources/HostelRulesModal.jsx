import React, { useState } from "react";
import { X, ScrollText, Search, Clock, Utensils, Volume2, Home, ShieldAlert, Download, ChevronRight, CheckCircle } from "lucide-react";

const RULES_DATA = [
  {
    id: 1,
    category: "Curfew & Gate",
    title: "Hostel Entry & Exit Timings",
    summary: "Hostel gates close strictly at 10:00 PM for all residents.",
    details: "All residents must return to the hostel premise by 10:00 PM. Night attendance will be recorded at 9:45 PM by floor wardens. Late entry requires a pre-approved Warden Late Pass.",
    severity: "Strict Policy",
    icon: Clock,
  },
  {
    id: 2,
    category: "Curfew & Gate",
    title: "Night Out Pass Procedure",
    summary: "Prior parent consent & warden approval mandatory for overnight stay outside.",
    details: "Any student planning to stay outside overnight or visit home must apply for a Night Out Pass at least 24 hours prior with parent verification.",
    severity: "Mandatory",
    icon: Clock,
  },
  {
    id: 3,
    category: "Mess & Dining",
    title: "Mess Meal Schedule & Hygiene",
    summary: "Breakfast (7:30-9:30 AM), Lunch (12:30-2:30 PM), Dinner (7:30-9:30 PM).",
    details: "Food is strictly served inside the dining hall. Taking mess utensils or food plates inside student rooms is strictly prohibited unless authorized during medical illness.",
    severity: "Standard Policy",
    icon: Utensils,
  },
  {
    id: 4,
    category: "Mess & Dining",
    title: "Food Waste Management Policy",
    summary: "Zero tolerance for excessive food wastage in the mess.",
    details: "Students are encouraged to take only as much food as required. Repeated waste of food will attract mess committee warnings.",
    severity: "Guidance",
    icon: Utensils,
  },
  {
    id: 5,
    category: "Discipline",
    title: "Quiet Hours & Noise Control",
    summary: "Silent study hours enforced from 11:00 PM to 6:00 AM.",
    details: "High volume music, shouting, or loud gatherings in corridors during quiet hours are prohibited to maintain a peaceful academic environment.",
    severity: "Strict Policy",
    icon: Volume2,
  },
  {
    id: 6,
    category: "Discipline",
    title: "Substance & Alcohol Ban",
    summary: "Zero tolerance policy towards alcohol, tobacco, and illicit substances.",
    details: "Possession, consumption, or influence of prohibited substances on hostel premises will lead to immediate disciplinary action and hostel expulsion.",
    severity: "Strict Policy",
    icon: ShieldAlert,
  },
  {
    id: 7,
    category: "Room & Premises",
    title: "Electrical Appliance Restrictions",
    summary: "High wattage heating appliances (heaters, induction stoves) prohibited.",
    details: "Only laptops, mobile chargers, study lamps, and hair dryers are allowed. High load appliances cause circuit overloads and fire hazards.",
    severity: "Mandatory",
    icon: Home,
  },
  {
    id: 8,
    category: "Room & Premises",
    title: "Room Cleanliness & Routine Inspection",
    summary: "Weekly room cleanliness inspections conducted by warden staff.",
    details: "Students are responsible for keeping their room clean and orderly. Walls must not be defaced with permanent markers or structural damage.",
    severity: "Standard Policy",
    icon: Home,
  },
  {
    id: 9,
    category: "Safety",
    title: "National Anti-Ragging Regulation",
    summary: "Strict zero-tolerance policy against any form of ragging or harassment.",
    details: "Ragging in any form is a punishable crime by law. Any student found engaging in physical, verbal, or psychological harassment will be expelled immediately.",
    severity: "Strict Policy",
    icon: ShieldAlert,
  },
];

const CATEGORIES = ["All Rules", "Curfew & Gate", "Mess & Dining", "Discipline", "Room & Premises", "Safety"];

export default function HostelRulesModal({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("All Rules");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  if (!isOpen) return null;

  const filteredRules = RULES_DATA.filter((rule) => {
    const matchesCat = selectedCategory === "All Rules" || rule.category === selectedCategory;
    const matchesSearch =
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Strict Policy":
        return "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900";
      case "Mandatory":
        return "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900";
      case "Standard Policy":
        return "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900";
      default:
        return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1A2F42] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#083067] to-[#0a4593] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <ScrollText className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hostel Rules & Regulations</h2>
              <p className="text-xs text-blue-200">Official code of conduct & hostel guidelines for residents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#162636] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rules (e.g. curfew, food, quiet hours, heater)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A2F42] text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-[#083067] focus:outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#083067] text-white"
                    : "bg-white dark:bg-[#1A2F42] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1f374e]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rules List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filteredRules.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No matching hostel rules found for "{searchQuery}".
            </div>
          ) : (
            filteredRules.map((rule) => {
              const IconComp = rule.icon;
              const isExpanded = expandedId === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                  className="bg-white dark:bg-[#162636] border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#083067] dark:text-blue-300 flex-shrink-0 mt-0.5">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-bold text-[#083067] dark:text-white">
                            {rule.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getSeverityBadge(rule.severity)}`}>
                            {rule.severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {rule.summary}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 mt-1 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#1A2F42] p-3 rounded-lg animate-fadeIn">
                      <p className="leading-relaxed"><strong className="text-gray-800 dark:text-gray-200">Rule Details:</strong> {rule.details}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Enforced by Warden Office & Student Advisory Committee
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 dark:bg-[#162636] border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>UniNest Resident Handbook 2026</span>
          <button
            onClick={() => alert("Downloading Hostel Rules Handbook PDF...")}
            className="flex items-center gap-1.5 text-[#083067] dark:text-blue-400 font-semibold hover:underline"
          >
            <Download className="w-4 h-4" /> Download Rulebook
          </button>
        </div>
      </div>
    </div>
  );
}
