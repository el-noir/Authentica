import {asyncHandler} from '../utils/asyncHandler.js';
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { access } from 'fs';

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
       return {accessToken, refreshToken}

    } catch (error){
        console.error("Error generating access and refresh tokens:", error.message);
        throw new ApiError("Error generating access and refresh tokens", 500);
    }
}

const registerUser = asyncHandler(async(req, res) => {
    const { fullName, email, password, username } = req.body;
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // validate required fields
    const requiredFields = { fullName, email, password, username }; // include username here
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
            throw new Error(`${key} is required`, 400);
        }
    }
    //validate email format 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        throw new ApiError("Invalid email format", 400);
    }
    //   // Validate username length
    if (username.length < 3) {
    throw new ApiError("Username must be at least 3 characters long", 400);
    }

    //check if user already exists 
    const existedUser = await User.findOne({ $or: [{username}, {email}]})
    if(existedUser) {
        throw new ApiError("Email or username already exists", 409);
    }
    // validate file uploads
    const avatarLocalPath = req.files?.avatar?.[0]?.path.replace("\\", "/");
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path.replace("\\", "/");
    console.log('Avatar file path: ', avatarLocalPath);
console.log('Cover Image file path: ', coverImageLocalPath);

    if (!avatarLocalPath) {
        console.error("Avatar upload is missing : ", req.files?.avatar);
        throw new ApiError("Please upload a valid avatar image", 400);
    }
    
    if (req.files?.coverImage && !coverImageLocalPath) {
        console.error("Cover image upload is missing : ", req.files?.coverImage);
    }
    
    // upload images to Cloudinary
    let avatar, coverImage;
    try {
        console.log("Uploading avatar to Cloudinary...");
        avatar = await uploadOnCloudinary(avatarLocalPath);

        if(coverImageLocalPath){
            console.log("Uploading cover image to Cloudinary...");
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
        }
    }catch(error){
        console.log("Cloudinary upload error : ", error);
        throw new ApiError("Failed to upload cover image to Cloudinary", 500, error.message);
    }
    if(!avatar?.url){
        throw new ApiError("Failed to upload avatar to Cloudinary", 500);
    }
    console.log("Avatar URL : ", avatar.url);
    console.log("Cover Image URL : ", coverImage?.url || "No cover image uploaded");

    // Create the user
    try {
     console .log("Creating user in database...");
     const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      username: username.toLowerCase(),
      password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      throw new ApiError("Failed to create user", 500);
    }

    console.log("User created successfully:", createdUser);
    return res.status(201).json(new ApiResponse(201, createdUser, "User Registered Successfully"));
  } catch (error) {
    console.error("Error during user creation:", error);
    throw new ApiError("Failed to create user", 500, error.message);
  }
});

const loginUser = asyncHandler(async(req, res) => {
    // req bod -> data
    // username or email 
    // find the user
    // password check
    // access and refresh token
    // send cookie 
    
    const {email, username, password} = req.body

    if((!username || !email)){
      throw new ApiError("Please provide username or email", 400)
    }
    
    const user = await User.findOne({ $or: [{username}, {email}]})

    if(!user){
      throw new ApiError("User not found", 401)
    }
    
    const isPasswordValid=  await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
     throw new ApiError("Password is not correct", 401)
    }
    
    // generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    // send access and refresh token as cookie
    const loggedInUser = await await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: true
    }
    return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
     new ApiResponse(
       200,
       {
         user: loggedInUser, accessToken,
         refreshToken
       },
       "User logged in successfully"
     )
   )
});

const logoutUser = asyncHandler(async(req, res) => {
   
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined
        }
      },
      {
        new: true,
      }
     )
  
  // send access and refresh token as cookie
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
 .status(200)
 .clearCookie("accessToken", options)
 .clearCookie("refreshToken", options)
 .json(
  new ApiResponse(
    200, {}, "User logged Out"
  )
 )
})

export {registerUser, loginUser, logoutUser} 