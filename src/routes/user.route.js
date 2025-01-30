import {Router} from 'express';
import {registerUser} from '../controllers/user.controller.js'
const router= new Router();

router.route("/register").post(
   registerUser
)

export default router;

// import { Router } from "express";
// import { loginUser, registerUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// const router = Router();

// // Use the upload middleware for both avatar and cover image
// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar", // Field name for avatar
//             maxCount: 1
//         },
//         {
//             name: "coverImage", // Field name for cover image
//             maxCount: 1
//         }
//     ]),
//     registerUser
// );

// router.route('/login').post(loginUser)

// //secured routes
// router.route('/logout').post(verifyJWT, logoutUser)
// router.route('/refresh-token').post(refreshAccessToken)
// export default router;
