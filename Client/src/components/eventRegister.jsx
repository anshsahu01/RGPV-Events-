import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import { toast } from "react-toastify";

 axios.defaults.baseURL = import.meta.env.VITE_BASE_URL ||  "http://localhost:3000";
function EventRegister() {


  const Id = useParams(); 
  const eventId = Id.eventId;
 
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    currentYearOfStudy: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const accessToken = localStorage.getItem("accessToken");
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if(!accessToken){
        console.log("no accesstoken");
        return;
      }
      
      
      const res = await axios.post(
        `/api/registrations/register-event`,
        {
          eventId,

          ...formData,
        },
        {
          headers: {
            Authorization:accessToken, // user token
          },
        }
      );

      if (res.data) {

        toast.success("Registered Successfully!");
        navigate("/");
      }
    } catch (error) {

      toast.error(
        error.response?.data?.message || "Something went wrong during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Event Registration
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <Input
          label="College/Institute"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="Enter your college name"
          required
        />

        <Input
          label="Current Year of Study"
          name="currentYearOfStudy"
          value={formData.currentYearOfStudy}
          onChange={handleChange}
          placeholder="e.g., 2nd Year"
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          type="tel"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default EventRegister;
