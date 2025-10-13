// import { Event } from "../models/event.model.js";
// import { ApiError } from "../utils/apiError.utils.js";
// import { ApiResponse } from "../utils/apiResponse.utils.js";
// import fs from "fs";
// import { uploadOnImageKit } from "../config/ImageKit.js";

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

// export const updateEvent = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const {
//       title,
//       description,
//       date,
//       location,
//       deadline,
//       bannerImage,
//       maxParticipants,
//       category,
//     } = req.body;

//     const event = await Event.findById(eventId);

//     // checking so that the owner only can update the event
//     if (event.createdBy.toString() !== req.user._id.toString()) {
//       throw new ApiError(403, "You are not authorized to update this event");
//     }

//     if (!event) {
//       throw new ApiError(404, "Event not found");
//     }

//     const updatedEvent = await Event.findByIdAndUpdate(
//       eventId,
//       {
//         $set: {
//           title,
//           description,
//           date,
//           deadline,
//           location,
//           bannerImage,
//           maxParticipants,
//           category,
//         },
//       },

//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedEvent) {
//       throw new ApiError(404, "Error in updating event");
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
//   } catch (error) {
//     console.error("Error while updating event", error.message);
//     throw new ApiError(500, "Failed to update Event");
//   }
// };

// // controller to delete event

// export const deleteEvent = async (req, res) => {
//   try {
//     const { eventId } = req.params;

//     if (!eventId) {
//       throw new ApiError(400, "Event id is required");
//     }

//     const event = await Event.findById(eventId);

//     if (event.createdBy.toString() !== req.user._id.toString()) {
//       throw new ApiError(403, "You are not authorized to update this event");
//     }

//     const deleteEvent = await Event.findByIdAndDelete(eventId);

//     if (!deleteEvent) {
//       throw new ApiError(404, "Unable to delete event");
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, {}, "Event deleted successfully"));
//   } catch (error) {
//     console.error("Error while deleting event:", error.message);
//     throw new ApiError(500, "Failed to delete event");
//   }
// };


// export const getEventById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json(new ApiResponse(400, {}, "Event ID is required"));
//     }

//     const event = await Event.findById(id).populate("createdBy", "name email");

//     if (!event) {
//       return res.status(404).json(new ApiResponse(404, {}, "Event not found"));
//     }

//     return res.status(200).json(new ApiResponse(200, event, "Event details fetched successfully"));
//   } catch (error) {
//     console.error("Error fetching event by ID:", error);
//     return res.status(500).json(new ApiResponse(500, {}, "Server error while fetching event"));
//   }
// };


// export const getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find().sort({ date: 1 }); // date ascending
//     return res
//       .status(200)
//       .json(new ApiResponse(200, events, "All events fetched successfully"));
//   } catch (error) {
//     console.error("Error fetching all events:", error);
//     throw new ApiError(500, "Error fetching all events");
//   }
// };




// export const getEventsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params; 
//     if (!category) {
//       return res.status(400).json(new ApiResponse(400, {}, "Category is required"));
//     }
//     const events = await Event.find({ category: new RegExp(`^${category}$`, "i") }).sort({ date: 1 });

//     return res.status(200).json(new ApiResponse(200, events, `Events in ${category} fetched successfully`));
//   } catch (error) {
//     console.error(`Error fetching events by category: ${req.params.category}`, error);
//     throw new ApiError(500, "Error fetching events by category");
//   }
// };


import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import fs from "fs";
import { uploadOnImageKit } from "../config/ImageKit.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      deadline,
      location,
      createdBy,
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

    const bannerImageLocalPath = req.file?.path;

    if (!bannerImageLocalPath) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Banner image is required"));
    }

    const bannerImage = await uploadOnImageKit(bannerImageLocalPath);

    if (!bannerImage || !bannerImage.url) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error uploading image on imagekit"));
    }

    const event = await Event.create({
      title,
      description,
      date,
      deadline,
      location,
      bannerImage: bannerImage.url,
      maxParticipants,
      createdBy: req.user._id,
      category,
    });

    if (!event) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error in creating event"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, event, "Event created successfully"));
  } catch (error) {
    console.error("Error in creating event:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error in creating event"));
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      title,
      description,
      date,
      location,
      deadline,
      bannerImage,
      maxParticipants,
      category,
    } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Event not found"));
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "You are not authorized to update this event"));
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $set: {
          title,
          description,
          date,
          deadline,
          location,
          bannerImage,
          maxParticipants,
          category,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEvent) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Error in updating event"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
  } catch (error) {
    console.error("Error while updating event:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Failed to update Event"));
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Event id is required"));
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Event not found"));
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "You are not authorized to delete this event"));
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Unable to delete event"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Event deleted successfully"));
  } catch (error) {
    console.error("Error while deleting event:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Failed to delete event"));
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Event ID is required"));
    }

    const event = await Event.findById(id).populate("createdBy", "name email");

    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Event not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, event, "Event details fetched successfully"));
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Server error while fetching event"));
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res
      .status(200)
      .json(new ApiResponse(200, events, "All events fetched successfully"));
  } catch (error) {
    console.error("Error fetching all events:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error fetching all events"));
  }
};

export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Category is required"));
    }

    const events = await Event.find({
      category: new RegExp(`^${category}$`, "i"),
    }).sort({ date: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          events,
          `Events in ${category} fetched successfully`
        )
      );
  } catch (error) {
    console.error(`Error fetching events by category:`, error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error fetching events by category"));
  }
}
