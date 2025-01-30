import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async(localFilePath) => {
try {
    if(!localFilePath){
      console.warn("No file path provided for Cloudinary upload.");
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
       resource_type: "auto", // automatically detect file type
    });
    console.log("File uploaded successfully to Cloudinary : ", response.url);
    fs.unlink(localFilePath);
    return response;
} catch (error) {
  console.log("Error uploading file to Cloudinary : ", error.message);
}
    // Attempt to delete the local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null; 
}

export {uploadOnCloudinary}
