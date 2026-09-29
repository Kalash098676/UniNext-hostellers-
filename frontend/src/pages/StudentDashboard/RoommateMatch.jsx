import React from 'react'
import { useState,useEffect } from 'react'
import {useAuth} from '../../context/AuthContext'
import { useNavigate } from "react-router-dom";
import api from '../../api/axios'
import PageHeader from "../../components/PageHeader";
import EmptyState from '../../components/EmptyState';
import { Users, Home, CheckCircle, Clock } from "lucide-react";

const RoommateMatch = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const[match,setMatch]=useState(null);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    fetchMatch();

  },[])
  const fetchMatch = async()=>{
    setLoading(true);
    try{
      const res = await api.get("/api/matching/my");
      setMatch(res.data);
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }
  };

  if(loading){
    return(
       <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E]">
        <p className="text-[#083067] dark:text-white font-medium">Loading...</p>
      </div>
    );
  }

 if (!match) {
  return (
    <EmptyState
      title="No Match Yet"
      icon={Users}
      description="Your profile and preferences are submitted! The warden will run the matching algorithm soon. You'll see your roommate here once you've been matched."
      primaryAction={() => navigate("/student-dashboard/preferences")}
      primaryLabel="View My Preferences"
      secondaryAction={() => navigate("/student-dashboard/profile")}
      secondaryLabel="View My Profile"
    />
  );
}

 const roommates = match.students.filter((s)=>s._id !== user?.id && s.email !== user?.email);
  const isConfirmed = match.status === "CONFIRMED";


  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0F1F2E] p-4 lg:p-6">
      <PageHeader title="Roommate Match" />

       <div className={`flex items-start sm:items-center gap-3 px-4 lg:px-5 py-3 rounded-2xl mb-6 ${
        isConfirmed
          ? "bg-emerald-50 dark:bg-emerald-900/20"
          : "bg-amber-50 dark:bg-amber-900/20"
      }`}>
        {isConfirmed
          ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          : <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
        }
        <div>
          <p className={`text-sm font-semibold ${isConfirmed ? "text-emerald-700" : "text-amber-700"}`}>
            {isConfirmed ? "Match Confirmed!" : "Match Found — Awaiting Room Assignment"}
          </p>
          <p className={`text-[10px] sm:text-xs mt-0.5 ${isConfirmed ? "text-emerald-600" : "text-amber-600"}`}>
            {isConfirmed
              ? `You've been assigned Room ${match.roomId}`
              : "The warden will assign your room shortly."}
          </p>
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Match details */}
        <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#083067] dark:text-white mb-4">
            Match Details
          </h2>
          <div className="space-y-3">
            <DetailRow label="Hostel Type" value={match.hostelType?.replace("_", " ")} />
            <DetailRow label="Room Type" value={`${match.roomType} Sharing`} />
            <DetailRow
              label="Compatibility Score"
              value={
                <span className="text-blue-500 font-bold">{match.compatibilityScore}%</span>
              }
            />

             <DetailRow
              label="Room Number"
              value={
                isConfirmed
                  ? <span className="text-emerald-600 font-bold">{match.roomId}</span>
                  : <span className="text-gray-400">Not assigned yet</span>
              }
            />
          </div>
        </div>

         <div className="bg-white dark:bg-[#1A2F42] rounded-2xl p-4 lg:p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#083067] dark:text-white mb-4">
            Your Roommate{roommates.length > 1 ? "s" : ""}
          </h2>
          <div className="space-y-3">
            {roommates.map((r) => (
              <div
                key={r._id}
                className="flex items-center gap-3 bg-gray-50 dark:bg-[#162636] rounded-xl p-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#083067] flex items-center justify-center text-white font-bold flex-shrink-0">
                  {r.name?.charAt(0).toUpperCase()}
                </div>
               <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#083067] dark:text-white">
                    {r.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 break-all">{r.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

         {/* Room assignment card — only when confirmed */}
        {isConfirmed && (
          <div className="bg-[#083067] rounded-2xl p-4 lg:p-5 md:col-span-2">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-blue-200 font-medium uppercase tracking-wider mb-0.5">
                  Your Room
                </p>
                <h3 className="text-2xl font-bold text-white">
                  Room {match.roomId}
                </h3>
                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5">
                  {match.hostelType?.replace("_", " ")} · {match.roomType} Sharing
                </p>
              </div>
            </div>
          </div>
        )}


        </div>
      </div>

  );
}


   function DetailRow({ label, value }) {
  return (
   <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <span className="text-[10px] sm:text-xs text-gray-400">{label}</span>
      <span className="text-[10px] sm:text-xs font-medium text-[#083067] dark:text-white text-right break-words">
        {value}
      </span>
    </div>
  )
}



export default RoommateMatch