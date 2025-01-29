import { connectDB } from './db/index.js';
import {app} from './app.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env' // Assuming your environment variables are stored in a.env file
})

connectDB()
.then(()=>{
    app.on('error',(error)=>{
    console.log("Error: ", error)
    })

    // start the server
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    });
})
.catch((err)=>{
    console.error("Connection failed: ", err);
})