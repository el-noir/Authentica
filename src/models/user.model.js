import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function(next){
   if(!this.isModified("password")) return next();
   // hash the password before saving to the database
   this.password = await bcrypt.hash(this.password, 10)
   next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
   return jwt.sign(
       {
           _id: this._id,
           email: this.email,
           username: this.username,
           fullName: this.fullName,
       },
       process.env.ACCESS_TOKEN_SECRET,
       { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
   );
};

userSchema.methods.generateRefreshToken = function() {
   return jwt.sign(
       {
           _id: this._id,
       },
       process.env.REFRESH_TOKEN_SECRET,
       { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
   );
};


export const User = mongoose.model('User', userSchema);
