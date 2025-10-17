


import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";


import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

import crypto from 'crypto'
import { IncomingMessage } from "http";



// funtion for hashing the tokens with the help of the crypto-js npm library

const hashToken = (token) => {
  crypto.createHash("sha256").update(token).digest("hex");
}


// NOTE - hum database mein hashed token hi store karenge and user means client ko actual token hi denge
// db mein hasehed isiliye taki agar db compromise ho to token na mile attackers ko


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error in tokens",error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// ===============================
// REGISTER USER
// ===============================
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("server hit !")

    if ([name, email, password].some((field) => !field?.trim())) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "All fields are required"));
    }

    console.log(name,password);

    // check if user already exists
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res
        .status(409)
        .json(new ApiResponse(409, {}, "User already exists"));
    }

    // create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Error while creating user"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.error("Error while registering user:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong while registering"));
  }
};


export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Email and password are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "User does not exist"));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid user credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // cookie options
    const options = {
      httpOnly: true,
      secure: false, // true for production 
      sameSite: "strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Error while logging in:",error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error while logging in user"));
  }
};





//  CONTROLLER TO REFRESH THE ACCESS TOKEN WITH THE REFRESH TOKEN




export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Refresh Token Not Provided"));
    }

    // Verify the refresh token
    let decodedToken;
    try {
      decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid or expired refresh token"));
    }

    // Find the user from DB
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "User not found for this token"));
    }

    // Compare tokens
    const hashedToken = hashToken(incomingRefreshToken);
    if (user.refreshToken !== hashedToken) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "Refresh token mismatch"));
    }

    // Generate new tokens
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Hash and store new refresh token
    const newHashedRefreshToken = hashToken(newRefreshToken);
    user.refreshToken = newHashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    // Send new tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Tokens refreshed successfully"
        )
      );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error while refreshing token"));
  }
};



// logout controller 

export const logoutUser = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "User not found"));
    }

  
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { 
            refreshToken: undefined },
      },
      { new: true }
    );


    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));




  } catch (error) {
    console.error("Error in logout:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong while logging out"));
  }
};


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user",
    });
  }
};






export const getHostedEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    const hostedEvents = await Event.find({ createdBy: userId }); 

    if (!hostedEvents || hostedEvents.length === 0) {
      return res.status(404).json({ message: "No hosted events found" });
    }

    res.status(200).json(hostedEvents);
  } catch (error) {
    console.error("Error fetching hosted events:", error);
    res.status(500).json({ message: "Server error" });
  }
}






export const getRegisteredEventsByUser = async (req, res) => {
  try {
    const {userId} = req.params; // Auth middleware se milta hai

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request",
      });
    }


    const registrations = await Registration.find({ user: userId })
      .populate("event", "title bannerImage date deadline location category")
      .sort({ createdAt: -1 }); // latest first

    if (!registrations || registrations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No registered events found",
        events: [],
      });
    }

    const registeredEvents = registrations.map((r) => r.event);

    return res.status(200).json({
      success: true,
      count: registeredEvents.length,
      events: registeredEvents,
    });
  } catch (error) {
    console.error("Error fetching registered events:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching registered events",
    });
  }
};

