import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  console.log("Cloudinary config: ", process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
  
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.warn("No file path provided or file does not exist.");
      return null;
    }

    // Upload the file to Cloudinary without the callback
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // automatically detect file type
    });

    console.log("File uploaded successfully to Cloudinary: ", response.url);

    // Remove the local file after uploading
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.log("Error uploading file to Cloudinary: ", error.message);
  }
};

export { uploadOnCloudinary };
