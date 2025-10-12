

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Input from "./Input";




 axios.defaults.baseURL = import.meta.env.VITE_BASE_URL ||  "http://localhost:3000";

function AddEvent() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isCreating, setIsCreating] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const { accessToken, userId } = useSelector((state) => state.auth);

  const eventCategories = ["Cultural", "Tech", "Entrepreneurship"]; 

  
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        setValue("description", html);
      });
    }
  }, [setValue]);

  const onSubmit = async (formData) => {
    try {
      setIsCreating(true);

      const descHTML = quillRef.current?.root?.innerHTML;
      if (!descHTML || descHTML === "<p><br></p>") {
        toast.error("Please enter a description");
        return;
      }

      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", descHTML);
      data.append("date", formData.date);
      data.append("deadline", formData.deadline);
      data.append("location", formData.location);
      data.append("maxParticipants", formData.maxParticipants || "");
      data.append("category", formData.category); 
      if (bannerImage) data.append("bannerImage", bannerImage);

      const res = await axios.post("/api/events/create-event", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: accessToken,
        },
      });

      if (res.data.success) {
        toast.success("Event created successfully ");
      } else {
        toast.error(res.data.message || "Error creating event");
      }

    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Server error while creating event");
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Create New Event</h2>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Banner</label>
          <label className="cursor-pointer flex items-center justify-center border-2 border-dashed rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            {preview ? (
              <img src={preview} alt="Banner Preview" className="w-full h-40 object-cover rounded" />
            ) : (
              <p className="text-gray-500 text-sm">Click to upload banner image</p>
            )}
          </label>
        </div>

        {/* Title */}
        <Input
          label="Event Title"
          type="text"
          placeholder="Enter event title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div ref={editorRef} className="h-48 border border-gray-300 rounded-md bg-white" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Date & Deadline */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Event Date"
            type="date"
            {...register("date", { required: "Event date is required" })}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

          <Input
            label="Registration Deadline"
            type="date"
            {...register("deadline")}
          />
        </div>

        {/* Location */}
        <Input
          label="Location"
          type="text"
          placeholder="Enter event location"
          {...register("location", { required: "Location is required" })}
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}

        {/* Max Participants */}
        <Input
          label="Max Participants"
          type="number"
          placeholder="Optional"
          {...register("maxParticipants")}
        />

        {/* Category Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="border border-blue-600 p-3 rounded-xl w-full"
          >
            <option value="">Select category</option>
            {eventCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {isCreating ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default AddEvent;



