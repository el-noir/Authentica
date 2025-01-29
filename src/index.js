import {app} from './app.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env' // Assuming your environment variables are stored in a.env file
})

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) =>{
    res.send('Hello, World!');
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});