import React from 'react'
import axios from 'axios';
import { useState } from "react";
import { User, Mail, Lock, Phone, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Link , useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';


const SignUp = () => {
  const navigate = useNavigate();
const { login } = useAuth();
const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  contactNo: "",
});


const handleSubmit = async(e)=>{
   e.preventDefault();
  setError("");
  try{
    const res = await api.post("/api/auth/register" ,
      formData
    )
      const data = await res.data;
      login(data);
      navigate("/student-dashboard");

  }catch(err){
       setError(err.response?.data?.message || "SignUp failed");
  }
}
    
  return (
     <div className="min-h-screen flex bg-gradient-to-br from-[#a8c5e0] via-[#5a7fa0] to-[#1B3C53]">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative z-10 text-center max-w-md">
          <GraduationCap className="w-20 h-20 mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold mb-4">Join UniNest Today</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Create your account, find your perfect roommate, and simplify
            your hostel life.
          </p>
        </div>
      </div>


       {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <Link to="/" className="inline-block text-xl font-bold text-[#1B3C53] mb-8">
            Uni<span className="text-blue-500">Nest</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Get started with your hostel dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                value={formData.name}
                onChange={(e)=> setFormData({...formData,name : e.target.value})}
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                 value={formData.email}
                onChange={(e)=> setFormData({...formData,email : e.target.value})}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                 value={formData.password}
                onChange={(e)=> setFormData({...formData,password : e.target.value})}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                 value={formData.contactNo}
                onChange={(e)=> setFormData({...formData,contactNo : e.target.value})}
                  type="tel"
                  placeholder="9999999999"
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent transition"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-[#1B3C53] text-white font-semibold rounded-lg hover:bg-[#234C6A] transition-colors shadow-md"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline hover:text-[#1B3C53]">Terms</a> and{" "}
            <a href="#" className="underline hover:text-[#1B3C53]">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1B3C53] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>

  )
}

export default SignUp