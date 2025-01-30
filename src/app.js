import express, { urlencoded } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
})); 

app.use(express.json({
    limit: '16kb',
}));

app.use(express.urlencoded({
    extended: true,
    limit: '16kb',
}))

app.use(express.static("public"));

app.use(cookieParser(
    
));

app.use('/api/v1/users', userRouter)

export {app}

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
// }
// ));

// app.use(express.json(  // when some data is recieved, we set its limit 
//     {
//         limit: '16kb',
//     }
// ));

// app.use(express.urlencoded({ // it is used for url encoding
//     extended: true,
//     limit: '16kb',
// }));
// app.use(express.static("public")); 

// app.use(cookieParser( // from server accessing the user browser's cookies and setting those.
     
// ));

// // routes

// // routers declaration
// app.use('/api/v1/users', userRouter);

// export {app}