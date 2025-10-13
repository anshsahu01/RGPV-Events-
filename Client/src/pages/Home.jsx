import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/eventCard";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; 
import HomeHero from "../components/herosection";



 axios.defaults.baseURL = "http://localhost:3000";  // import.meta.env.VITE_BASE_URL ||  

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/events/all-events"); 
      if (res.data.success) {
        setEvents(res.data.data);
        
      } else {
        toast.error(res.data.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Server error while fetching events");
    } finally {
      setLoading(false);
    }
  };

  console.log(events);

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <HomeHero/>
    

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => 
   event._id && (
        <EventCard
          key={event._id}
          _id={event._id}
          title={event.title}
          bannerImage={event.bannerImage}
          date={event.date}
          deadline={event.deadline}
          location={event.location}
          category={event.category}
        />
      ))}
        </div>
      )}
    </div>
  );
}

export default Home;
