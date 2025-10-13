import { Registration } from "../models/registration.model.js";
import { Event } from "../models/event.model.js";
import {ApiError} from '../utils/apiError.utils.js'
import {ApiResponse }from '../utils/apiResponse.utils.js'




export const registerForEvent = async (req, res) => {

    try {
        console.log(req.body);

        const userId = req.user._id;
        if(!userId){
            throw new ApiError("Invalid user");

        }
      

        const {eventId, name, college, currentYearOfStudy, phone} = req.body;

        if ([eventId, name, college, currentYearOfStudy, phone].some((field) => !field?.trim())) {
    throw new ApiError(400, "Please fill all the required fields.");
}

        const event = await Event.findById(eventId);

        if (new Date() > new Date(event.deadline)) {
    throw new ApiError(400, "Registration deadline has passed for this event.");
}


const registrationCount = await Registration.countDocuments({ event: eventId });
if (registrationCount >= event.maxParticipants) {
    throw new ApiError(400, "Sorry, this event is already full.");
}

if (new Date() > new Date(event.date)) {
    throw new ApiError(400, "This event has already taken place.");
}

        if(!event){
            throw new ApiError(404,"Event no found");
        }

        const alreadyRegistered = await Registration.findOne({
            event : eventId,
            user : userId
        })


        if(alreadyRegistered){
            throw new ApiError(400, "Already registered");
        }


        // ab registration create karengae


        const registration = await Registration.create({
            event : eventId,
            user : userId,
            name,
            college,
            currentYearOfStudy,
            email : req.user.email,
            phone
        })



        if(!registration){
            throw new ApiError("Error in registering");
        }



        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                registration,
                "Registered Successfully"
            )
        )
        
    } catch (error) {


        console.log("Error while registering for the event", error.message);
        throw new ApiError(500, "Somethong went wrong while registering for event");
        
    }




}


