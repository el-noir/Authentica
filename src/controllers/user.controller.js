import {asyncHandler} from '../utils/asyncHandler.js';
import {User} from '../models/user.model.js'

const registerUser = asyncHandler(async(req, res) => {
    const {fullName, email, password} = req.body;
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // validate required fields
    const requiredFields = {fullName, email, password};
    for(const [key, value] of Object.entries(requiredFields)){
        if(!value || value.trim() === ""){
            throw new Error(`${key} is required`, 400);
        }
    }
    //validate email format 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        throw new Error("Invalid email format", 400);
    }
    //   // Validate username length
    if (username.length < 3) {
    throw new ApiError("Username must be at least 3 characters long", 400);
    }

    //check if user already exists 
    const existedUser = await User.findOne({ $or: [{username}, {email}]})
    if(existedUser) {
        throw new Error("Email or username already exists", 409);
    }
    // validate file uploads
    const avatarLocalPath = req.file?.avatar?.[0]?.path.replace("\\", "/");
    const coverImageLocalPath = req.file?.coverImage?.[0]?.path.replace("\\", "/");

    if(!avatarLocalPath){
        console.error("Avatar upload is missing : ", req.file?.avatar);
        throw new ApiError("Please upload a valid avatar image", 400);
    }
    if(req.file?.coverImage && !coverImageLocalPath){
        console.error("Cover image upload is missing : ", req.file?.coverImage);
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

export {registerUser}