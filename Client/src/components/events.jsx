import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FiMapPin, FiCalendar, FiShare2 } from "react-icons/fi";



//  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL ||  "http://localhost:3000";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/event/${id}`);
        if (res.data.success) {
          setEvent(res.data.data);
        } else {
          toast.error(res.data.message || "Event not found");
        }
      } catch (error) {
       
        toast.error("Server error while fetching event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleRegister = () => {
    
    navigate(`/registerforevent/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <img
        src={event.bannerImage}
        alt={event.title}
        className="w-full h-64 md:h-80 object-cover rounded-xl mb-6 shadow-md"
      />

      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{event.title}</h1>

      <div className="flex flex-col sm:flex-row sm:space-x-6 mb-4 text-gray-700">
        <div className="flex items-center mb-2 sm:mb-0">
          <FiCalendar className="mr-2 w-5 h-5 text-blue-600" />
          <span>Event: {formatDate(event.date)}</span>
        </div>
        <div className="flex items-center">
          <FiCalendar className="mr-2 w-5 h-5 text-red-600" />
          <span>Deadline: {formatDate(event.deadline)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center text-gray-600 mb-4 sm:mb-0">
          <FiMapPin className="mr-2 w-5 h-5" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRegister} // ✅ Add onclick
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
          <FiShare2 className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition" />
        </div>
      </div>

      <div className="text-gray-700 space-y-4" dangerouslySetInnerHTML={{ __html: event.description }}></div>
    </div>
  );
}

export default EventDetails;
