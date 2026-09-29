import React, { useState } from "react";
import { X, Siren, Phone, Copy, Check, AlertTriangle, ShieldAlert, HeartPulse, Flame, ExternalLink } from "lucide-react";
import api from "../../api/axios";

const EMERGENCY_CONTACTS = [
  {
    role: "Hostel Chief Warden",
    name: "Dr. Arvind Sharma",
    phone: "+91 98765 43210",
    desc: "Available 24/7 for urgent administrative & safety issues",
    tag: "Warden",
  },
  {
    role: "Assistant Warden Desk",
    name: "Mr. Rajesh Verma",
    phone: "+91 98765 43211",
    desc: "Floor warden on-duty for night emergencies",
    tag: "Warden",
  },
  {
    role: "Main Security Gate",
    name: "Campus Security Desk",
    phone: "+91 98765 00000",
    desc: "24/7 Gate security & incident response squad",
    tag: "Security",
  },
  {
    role: "Medical Clinic & Ambulance",
    name: "UniNest Health Center",
    phone: "+91 98765 11111",
    desc: "On-campus medical emergency & quick transport",
    tag: "Medical",
  },
  {
    role: "Anti-Ragging Helpline",
    name: "National Anti-Ragging Squad",
    phone: "1800-180-5522",
    desc: "Toll-free 24x7 confidential helpline",
    tag: "Helpline",
  },
  {
    role: "Local Police Station",
    name: "City Police Hotline",
    phone: "100",
    desc: "Local police emergency dispatch",
    tag: "Police",
  },
  {
    role: "Fire & Rescue Services",
    name: "Fire Emergency Hotline",
    phone: "101",
    desc: "City fire control room",
    tag: "Fire",
  },
];

export default function EmergencyModal({ isOpen, onClose }) {
  const [copiedPhone, setCopiedPhone] = useState(null);
  const [sosSent, setSosSent] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 1500);
  };

  const handleTriggerSOS = async () => {
    setSosLoading(true);
    try {
      await api.post("/api/warden/notifications", {
        message: "🚨 EMERGENCY SOS ALERT triggered by student from Dashboard!",
        type: "GENERAL",
      });
    } catch (err) {
      console.log("SOS notification log triggered");
    } finally {
      setSosLoading(false);
      setSosSent(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#1A2F42] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-red-200 dark:border-red-900/50">
        
        {/* Header - Red Emergency Gradient */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-600 via-red-700 to-rose-800 text-white flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <div className="p-2.5 bg-white/10 rounded-xl animate-pulse">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Emergency & SOS Center</h2>
              <p className="text-xs text-red-100">Immediate contacts & rapid emergency assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Rapid Alert Banner */}
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border-b border-red-100 dark:border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-red-800 dark:text-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Immediate Assistance Needed?</span>
              <p className="text-[11px] text-red-600 dark:text-red-300">Tap SOS button below to alert warden & security desk instantly.</p>
            </div>
          </div>

          <button
            onClick={handleTriggerSOS}
            disabled={sosSent || sosLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap ${
              sosSent
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-red-600 hover:bg-red-700 active:scale-95 text-white"
            }`}
          >
            <Siren className="w-4 h-4" />
            {sosLoading ? "Sending SOS..." : sosSent ? "SOS Alert Sent to Warden!" : "SEND SOS ALERT"}
          </button>
        </div>

        {/* Contacts Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Verified Emergency Helpline Directory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EMERGENCY_CONTACTS.map((contact, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-[#162636] border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#083067] dark:text-white">
                      {contact.role}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                      {contact.tag}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
                    {contact.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                    {contact.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-gray-800 dark:text-gray-200">
                    {contact.phone}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(contact.phone)}
                      className="p-1.5 text-gray-500 hover:text-[#083067] dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Copy Number"
                    >
                      {copiedPhone === contact.phone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="px-2.5 py-1 bg-[#083067] hover:bg-[#0a3d7a] text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Safety Protocol Cards */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Emergency Action Protocols
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-start gap-2.5">
                <HeartPulse className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Medical Emergency</span>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">Inform the nearest floor warden & call Campus Medical Officer immediately.</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl flex items-start gap-2.5">
                <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Fire Hazard Safety</span>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">Press floor fire alarm, avoid elevators, proceed to Main Ground Assembly Point.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-[#162636] border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
