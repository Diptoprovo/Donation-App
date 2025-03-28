import express from "express";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import cors from 'cors';
import cookieParser from "cookie-parser";


const app = express();
const port = process.env.PORT || 4000;
connectDB();

// const allowedOrigins = ['http://localhost:5173']
const allowedOrigins = [];
app.use(express.json);
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));


app.get('/', (req, res) => {
    res.send('API WORKING');
})


app.listen(port, () => console.log(`Server started on PORT: ${port}`))