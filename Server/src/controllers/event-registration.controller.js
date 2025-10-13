// import { Registration } from "../models/registration.model.js";
// import { Event } from "../models/event.model.js";
// import {ApiError} from '../utils/apiError.utils.js'
// import {ApiResponse }from '../utils/apiResponse.utils.js'




// export const registerForEvent = async (req, res) => {

//     try {
//         console.log(req.body);

//         const userId = req.user._id;
//         if(!userId){
//             throw new ApiError("Invalid user");

//         }
      

//         const {eventId, name, college, currentYearOfStudy, phone} = req.body;

//         if ([eventId, name, college, currentYearOfStudy, phone].some((field) => !field?.trim())) {
//     throw new ApiError(400, "Please fill all the required fields.");
// }

//         const event = await Event.findById(eventId);

//         if (new Date() > new Date(event.deadline)) {
//     throw new ApiError(400, "Registration deadline has passed for this event.");
// }

// // Check 2: Kya event full ho chuka hai?
// const registrationCount = await Registration.countDocuments({ event: eventId });
// if (registrationCount >= event.maxParticipants) {
//     throw new ApiError(400, "Sorry, this event is already full.");
// }

// if (new Date() > new Date(event.date)) {
//     throw new ApiError(400, "This event has already taken place.");
// }

//         if(!event){
//             throw new ApiError(404,"Event no found");
//         }

//         // checking agar use ne already register kiya hai

//         const alreadyRegistered = await Registration.findOne({
//             event : eventId,
//             user : userId
//         })


//         if(alreadyRegistered){
//             throw new ApiError(400, "Already registered");
//         }


//         // ab registration create karengae


//         const registration = await Registration.create({
//             event : eventId,
//             user : userId,
//             name,
//             college,
//             currentYearOfStudy,
//             email : req.user.email,
//             phone
//         })



//         if(!registration){
//             throw new ApiError("Error in registering");
//         }



//         return res
//         .status(201)
//         .json(
//             new ApiResponse(
//                 201,
//                 registration,
//                 "Registered Successfully"
//             )
//         )
        
//     } catch (error) {


//         console.log("Error while registering for the event", error.message);
//         throw new ApiError(500, "Somethong went wrong while registering for event");
        
//     }




// }

import { Registration } from "../models/registration.model.js";
import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

export const registerForEvent = async (req, res) => {
  try {
    console.log(req.body);

    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid user"));
    }

    const { eventId, name, college, currentYearOfStudy, phone } = req.body;

    // Validate required fields
    if (
      [eventId, name, college, currentYearOfStudy, phone].some(
        (field) => !field?.toString().trim()
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Please fill all the required fields."));
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Event not found"));
    }

    // Check deadline
    if (new Date() > new Date(event.deadline)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Registration deadline has passed for this event."
          )
        );
    }

    // Check if event is full
    const registrationCount = await Registration.countDocuments({
      event: eventId,
    });

    if (registrationCount >= event.maxParticipants) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Sorry, this event is already full."));
    }

    // Check if event has already happened
    if (new Date() > new Date(event.date)) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "This event has already taken place.")
        );
    }

    // Check if already registered
    const alreadyRegistered = await Registration.findOne({
      event: eventId,
      user: userId,
    });

    if (alreadyRegistered) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Already registered"));
    }

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      user: userId,
      name,
      college,
      currentYearOfStudy,
      email: req.user.email,
      phone,
    });

    if (!registration) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error in registering"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, registration, "Registered Successfully"));
  } catch (error) {
    console.log("Error while registering for the event:", error.message);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong while registering for event"
        )
      );
  }
};


