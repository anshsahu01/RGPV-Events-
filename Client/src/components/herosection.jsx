import React from "react";
import { useNavigate } from "react-router-dom";

const HomeHero = () => {
  const navigate = useNavigate(); 

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
  
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Discover & Participate in Amazing Events
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl mb-8">
            Join hackathons, cultural fests, and entrepreneurial events. Connect, learn, and showcase your talent across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
              onClick={() => navigate("/")} // 
            >
              Explore Events
            </button>
            <button
              onClick={() => navigate("/hostevent")} // ✅ Host event route
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
            >
              Host an Event
            </button>
          </div>
        </div>

        
        <div className="flex-1">
          <img
            src="Hero1.png"
            alt="Events Illustration"
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
