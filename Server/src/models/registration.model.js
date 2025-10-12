import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    
    required: true,
  },
  currentYearOfStudy: {
    type: String,
    enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const Registration = mongoose.model("Registration", registrationSchema);
