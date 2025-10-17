import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import EventCard from "../components/eventCard";
import { FiUser, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

function Profile() {
  const [user, setUser] = useState(null);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    // if (!accessToken || !userId) {
    //   toast.error("Please login first!");
    //   navigate("/login");
    //   return;
    // }

    const fetchProfileData = async () => {

      setLoading(true);
      try {
       
        const userRes = await api.get(`/user/${userId}`);

        
        const userData = userRes.data.user;
 
        if (!userData) {
          throw new Error("User data not found in API response.");
        }
        
        setUser(userData);

       
        const [hostedRes, registeredRes] = await Promise.all([
          api.get(`/user/usershostedevents/${userId}`),
          api.get(`/user/registered-events/${userId}`),
        ]);
        

        const hosted = hostedRes.data.data?.events || hostedRes.data.events || hostedRes.data.data || hostedRes.data || [];
        setHostedEvents(Array.isArray(hosted) ? hosted : []);

   
        const registered = registeredRes.data.events || registeredRes.data.data?.events || registeredRes.data.data || [];
        setRegisteredEvents(Array.isArray(registered) ? registered : []);

      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load profile data"
        );
     
      } finally {
 
        setLoading(false);
      }
    };

    fetchProfileData();

  }, [ userId, navigate]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-600 text-lg">
           Could not load your profile. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    {user?.name || user?.username || "User"}
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                    <FiMail className="text-blue-600" />
                    {user?.email || "No email provided"}
                </p>
                {user?.role && (
                    <p className="text-sm text-gray-500 mt-2">
                        Role: <span className="font-semibold">{user.role}</span>
                    </p>
                )}
            </div>
        </div>


        <section className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Events You Hosted
            </h3>
            {hostedEvents.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-10 text-center">
                    <p className="text-gray-500 mb-4">
                        You haven't hosted any events yet.
                    </p>
                    <button
                        onClick={() => navigate("/hostevent")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Create Your First Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostedEvents.map((event) => (
                        <EventCard key={event._id} {...event} />
                    ))}
                </div>
            )}
        </section>

        <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Events You Registered For
            </h3>
            {registeredEvents.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-10 text-center">
                    <p className="text-gray-500 mb-4">
                        You haven’t registered for any events yet.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Explore Events
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map((event) => (
                        <EventCard key={event._id} {...event} />
                    ))}
                </div>
            )}
        </section>
    </div>
  );
}

export default Profile;