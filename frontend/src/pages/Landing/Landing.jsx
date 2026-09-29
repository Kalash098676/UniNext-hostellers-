import React, { useState, useEffect } from "react";
import { rotatingTexts } from "./Constants";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Landing() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
        <Header/>
      <section className="bg-gradient-to-r from-blue-200 to-[#22435b] min-h-screen flex items-center pt-16 py-12 px-6 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-16">
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 md:mb-6">
                Your portal for
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
                <span
                  key={currentTextIndex}
                  className="inline-block bg-gradient-to-r from-[#1B3C53] to-blue-800 text-transparent bg-clip-text"
                >
                  {rotatingTexts[currentTextIndex]}
                </span>
              </h1>
            </div>

            <p className="text-gray-800 text-base md:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
              <span className="font-bold text-gray-900">UniNest</span> — A smart hostel & student living platform that matches students with{" "}
              <span className="text-black font-bold">compatible roommates</span>{" "}
              based on preferences. Streamlines complaints and mess feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <a
                href="/login"
                className="bg-[#1B3C53] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
              >
                Let's Get Started
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center">
  <img
    src="/student_accomodation1.png"
    alt="Hostel Management Illustration"
    className="w-full max-w-xs sm:max-w-md md:max-w-lg"
  />
</div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Hostel Living
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From finding compatible roommates to addressing maintenance
              requests, our platform is designed to improve your hostel life.
            </p>
          </div>

          <div className="space-y-10 md:space-y-12">
            <FeatureRow
              img="/roommatematch.png"
              title="Intelligent Roommate Matching"
              text="Our advanced algorithm analyzes your lifestyle preferences, study habits, and personality traits to connect you with the most compatible roommates."
              points={["Personality Analysis", "Smart Matching"]}
            />
            <FeatureRow
              img="/issuereporting.png"
              title="Easy Issue Reporting"
              text="Report maintenance issues, complaints, or requests instantly through our intuitive interface. Track resolution progress in real-time."
              points={["Real-time Tracking", "Instant Notifications"]}
              reverse
            />
            <FeatureRow
              img="/simplifiedhostellife.png"
              title="Simplified Hostel Life"
              text="Access your personalized dashboard to manage everything from meal planning and study schedules to hostel announcements and community events."
              points={["Unified Dashboard", "Community Events"]}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function FeatureRow({ img, title, text, points, reverse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-300 rounded-2xl p-6 md:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div
        className={`w-full aspect-[592/320] bg-gray-100 rounded-xl overflow-hidden ${
          reverse ? "md:order-2" : ""
        }`}
      >
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition duration-200"
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h3>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {text}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {points.map((p) => (
            <span key={p} className="flex items-center">
              ✓ {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
