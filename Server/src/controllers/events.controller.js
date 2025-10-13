import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import fs from "fs";
import { uploadOnImageKit } from "../config/ImageKit.js";

// export const createEvent = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       date,
//       deadline,
//       location,
//       createdBy,
//       maxParticipants,
//       category,
//     } = req.body;

//     if (
//       [title, description, date, location, category].some(
//         (field) => !field?.trim()
//       )
//     ) {
//       return res
//         .status(400)
//         .json(new ApiResponse(400, {}, "All fields are required"));
//     }

//     const bannerImageLocalPath = req.file?.path;

//     if (!bannerImageLocalPath) {
//       throw new ApiError(400, "Banner image is required");
//     }

//     //now uploading the image on the imageKit

//     const bannerImage = await uploadOnImageKit(bannerImageLocalPath);

//     if (!bannerImage || !bannerImage.url) {
//       throw new ApiError(500, "Error uplaoding image on imagekit");
//     }
//     const event = await Event.create({
//       title,
//       description,
//       date,
//       deadline,
//       location,
//       bannerImage: bannerImage.url,
//       maxParticipants,
//       createdBy: req.user._id,
//       category,
//     });

//     if (!event) {
//       throw new ApiError("Error in creating event");
//     }

//     return res
//       .status(201)
//       .json(new ApiResponse(201, event, "Event created successfully"));
//   } catch (error) {
//     console.error("Error in creating event", error);
//     throw new ApiError(500, "Error in creating event");
//   }
// };

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      deadline,
      location,
      maxParticipants,
      category,
    } = req.body;

   
    if (
      [title, description, date, location, category].some(
        (field) => !field?.trim()
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "All fields are required"));
    }

    if (!req.file) {
      throw new ApiError(400, "Banner image is required");
    }

    const bannerFileBuffer = req.file.buffer;
    const originalFileName = req.file.originalname;

    const uploadedBanner = await uploadOnImageKit(bannerFileBuffer, originalFileName);

    if (!uploadedBanner || !uploadedBanner.url) {
      throw new ApiError(500, "Error uploading image on ImageKit");
    }
    

    const event = await Event.create({
      title,
      description,
      date,
      deadline,
      location,
      bannerImage: uploadedBanner.url,
      maxParticipants,
      createdBy: req.user._id,
      category,
    });

    if (!event) {
      throw new ApiError(500, "Error in creating event");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, event, "Event created successfully"));

  } catch (error) {
    console.error("Error in creating event", error);

    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        success: false
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { ...fieldsToUpdate } = req.body; 

    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }


    if (event.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to update this event");
    }

    if (req.file) {
      const bannerFileBuffer = req.file.buffer;
      const originalFileName = req.file.originalname;

      const uploadedBanner = await uploadOnImageKit(bannerFileBuffer, originalFileName);
      if (!uploadedBanner || !uploadedBanner.url) {
        throw new ApiError(500, "Failed to update banner image on ImageKit");
      }
      

      fieldsToUpdate.bannerImage = uploadedBanner.url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: fieldsToUpdate }, 
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      throw new ApiError(500, "Error in updating event");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedEvent, "Event updated successfully"));

  } catch (error) {
    console.error("Error while updating event", error.message);
     return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        success: false
    });
  }
};

// controller to delete event

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      throw new ApiError(400, "Event id is required");
    }

    const event = await Event.findById(eventId);

    if (event.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to update this event");
    }

    const deleteEvent = await Event.findByIdAndDelete(eventId);

    if (!deleteEvent) {
      throw new ApiError(404, "Unable to delete event");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Event deleted successfully"));
  } catch (error) {
    console.error("Error while deleting event:", error.message);
    throw new ApiError(500, "Failed to delete event");
  }
};


export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(new ApiResponse(400, {}, "Event ID is required"));
    }

    const event = await Event.findById(id).populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json(new ApiResponse(404, {}, "Event not found"));
    }

    return res.status(200).json(new ApiResponse(200, event, "Event details fetched successfully"));
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return res.status(500).json(new ApiResponse(500, {}, "Server error while fetching event"));
  }
};


export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // date ascending
    return res
      .status(200)
      .json(new ApiResponse(200, events, "All events fetched successfully"));
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new ApiError(500, "Error fetching all events");
  }
};




export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params; 
    if (!category) {
      return res.status(400).json(new ApiResponse(400, {}, "Category is required"));
    }
    const events = await Event.find({ category: new RegExp(`^${category}$`, "i") }).sort({ date: 1 });

    return res.status(200).json(new ApiResponse(200, events, `Events in ${category} fetched successfully`));
  } catch (error) {
    console.error(`Error fetching events by category: ${req.params.category}`, error);
    throw new ApiError(500, "Error fetching events by category");
  }
};



