import mongoose from 'mongoose';

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
     },
     fullName: {
        type: String,
        required: true,
        trime: true,
        index: true,
     },
     avatar: { // cloudinary url
        type: String,
        required: true,
     },
     coverImage: { // cloudinary url
        type: String,
     },
     password: {
        type: String,
        required : [true, "Password is required"]
     },
     refreshToken: {
        type : String
    }
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);
