import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true

    },
    description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },

  deadline : {
    type : Date,
    required : true
  },
  location: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String, // Cloudinary URL ya file path
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Kisne event banaya
    required: true,
  },
  maxParticipants: {
    type: Number,
    default: 100,
  },

   category: {
    type: String,
    enum: ["Cultural", "Tech", "Entrepreneurship"], // sirf inme se koi value hi valid hogi
    required: true,
    default: "Cultural"
  }
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
