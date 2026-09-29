import React from "react";
import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Heart, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b1b2b] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block text-2xl font-bold text-white">
              Uni<span className="text-blue-400">Nest</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Smart Hostel & Student Management System. Connecting students with compatible roommates, streamlining maintenance requests, and simplifying campus living.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 text-xs bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full border border-blue-800">
                <Shield className="w-3.5 h-3.5" /> ISO 27001 Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">
                  Features Overview
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Warden / Staff Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-400 transition-colors">
                  New Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Roommate Matching
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Issue & Complaint Tracking
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Digital Visitor Passes
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Mess Menu & Meal Feedback
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Help
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Campus Hostel Block A & B, University Road</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+91 1800-UNINEST (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>support@uninest.edu</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} UniNest Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Hostel Rules</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
