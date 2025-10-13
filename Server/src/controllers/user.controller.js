


// import { User } from "../models/User.model.js";
// import jwt from "jsonwebtoken";
// import { Event } from "../models/event.model.js";
// import { Registration } from "../models/registration.model.js";

// // utils
// import { ApiError } from "../utils/apiError.utils.js";
// import { ApiResponse } from "../utils/apiResponse.utils.js";

// // function to generate access and refresh token
// const generateAccessAndRefreshToken = async (userId) => {
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       throw new ApiError(404, "User not found while generating tokens");
//     }

//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.log("Error in tokens",error);
//     throw new ApiError(
//       500,
//       "Something went wrong while generating refresh and access token"
//     );
//   }
// };

// // ===============================
// // REGISTER USER
// // ===============================
// export const registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;
//     console.log("server hit !")

//     if ([name, email, password].some((field) => !field?.trim())) {
//       return res
//         .status(400)
//         .json(new ApiResponse(400, {}, "All fields are required"));
//     }

//     console.log(name,password);

//     // check if user already exists
//     const existedUser = await User.findOne({ email });

//     if (existedUser) {
//       return res
//         .status(409)
//         .json(new ApiResponse(409, {}, "User already exists"));
//     }

//     // create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     const createdUser = await User.findById(user._id).select("-password");

//     if (!createdUser) {
//       return res
//         .status(500)
//         .json(new ApiResponse(500, {}, "Error while creating user"));
//     }

//     return res
//       .status(201)
//       .json(new ApiResponse(201, createdUser, "User registered successfully"));
//   } catch (error) {
//     console.error("Error while registering user:", error.message);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, {}, "Something went wrong while registering"));
//   }
// };


// export const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json(new ApiResponse(400, {}, "Email and password are required"));
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(404)
//         .json(new ApiResponse(404, {}, "User does not exist"));
//     }

//     const isPasswordValid = await user.comparePassword(password);

//     if (!isPasswordValid) {
//       return res
//         .status(401)
//         .json(new ApiResponse(401, {}, "Invalid user credentials"));
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
//       user._id
//     );

//     const loggedInUser = await User.findById(user._id).select(
//       "-password -refreshToken"
//     );

//     // cookie options
//     const options = {
//       httpOnly: true,
//       secure: true, // set false if testing on localhost
//       sameSite: "strict",
//     };

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", refreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           { user: loggedInUser, accessToken, refreshToken },
//           "User logged in successfully"
//         )
//       );
//   } catch (error) {
//     console.error("Error while logging in:",error);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, {}, "Error while logging in user"));
//   }
// };


// // logout controller 

// export const logoutUser = async (req, res) => {
//   try {

//     if (!req.user || !req.user._id) {
//       return res
//         .status(401)
//         .json(new ApiResponse(401, {}, "User not found"));
//     }

  
//     await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         $set: { 
//             refreshToken: undefined },
//       },
//       { new: true }
//     );


//     const options = {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//     };

//     return res
//       .status(200)
//       .clearCookie("accessToken", options)
//       .clearCookie("refreshToken", options)
//       .json(new ApiResponse(200, {}, "User logged out successfully"));




//   } catch (error) {
//     console.error("Error in logout:", error.message);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, {}, "Something went wrong while logging out"));
//   }
// };


// export const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params; 

//     if (!id) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const user = await User.findById(id).select("-password"); 

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error("Error fetching user by ID:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching user",
//     });
//   }
// };






// export const getHostedEvents = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const hostedEvents = await Event.find({ createdBy: userId }); 

//     if (!hostedEvents || hostedEvents.length === 0) {
//       return res.status(404).json({ message: "No hosted events found" });
//     }

//     res.status(200).json(hostedEvents);
//   } catch (error) {
//     console.error("Error fetching hosted events:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }






// export const getRegisteredEventsByUser = async (req, res) => {
//   try {
//     const {userId} = req.params; // Auth middleware se milta hai

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID not found in request",
//       });
//     }


//     const registrations = await Registration.find({ user: userId })
//       .populate("event", "title bannerImage date deadline location category")
//       .sort({ createdAt: -1 }); // latest first

//     if (!registrations || registrations.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No registered events found",
//         events: [],
//       });
//     }

//     const registeredEvents = registrations.map((r) => r.event);

//     return res.status(200).json({
//       success: true,
//       count: registeredEvents.length,
//       events: registeredEvents,
//     });
//   } catch (error) {
//     console.error("Error fetching registered events:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching registered events",
//     });
//   }
// };

import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

// Generate tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error in tokens:", error);
    throw error;
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Register hit!");

    if ([name, email, password].some((field) => !field?.trim())) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "All fields are required"));
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res
        .status(409)
        .json(new ApiResponse(409, {}, "User already exists"));
    }

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

// Login User
export const loginUser = async (req, res) => {
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

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
    console.error("Error while logging in:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error while logging in user"));
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiResponse(401, {}, "User not found"));
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: undefined },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required"));
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong while fetching user"
        )
      );
  }
};

// Get Hosted Events
export const getHostedEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    const hostedEvents = await Event.find({ createdBy: userId });

    if (!hostedEvents || hostedEvents.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No hosted events found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, hostedEvents, "Hosted events fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching hosted events:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Server error"));
  }
};

// Get Registered Events
export const getRegisteredEventsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID not found in request"));
    }

    const registrations = await Registration.find({ user: userId })
      .populate("event", "title bannerImage date deadline location category")
      .sort({ createdAt: -1 });

    if (!registrations || registrations.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No registered events found"));
    }

    const registeredEvents = registrations.map((r) => r.event);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          registeredEvents,
          "Registered events fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching registered events:", error.message);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong while fetching registered events"
        )
      );
  }
};
