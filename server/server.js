import express from "express";
import 'dotenv/config';
import { createServer } from "http";  // ✅ Import createServer
import connectDB from "./config/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";  // ✅ Import Server from Socket.IO

import authRouter from "./routes/authRoutes.js";
import donorRouter from "./routes/donorRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import receiverRouter from "./routes/receiverRoutes.js";
import requestRouter from "./routes/requestRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";

const app = express();
const httpServer = createServer(app);  // ✅ Create HTTP server
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// const allowedOrigins = ['http://localhost:5173']
const allowedOrigins = [];
app.use(express.json);
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));


app.get('/', (req, res) => {
    res.send('API WORKING');
})

app.use('/api/auth', authRouter);
app.use('/api/donor', donorRouter);
app.use('/api/item', itemRouter);
app.use('/api/receiver', receiverRouter);
app.use('/api/request', requestRouter);
app.use('/api/transaction', transactionRouter);

// ✅ Use httpServer.listen instead of app.listen
httpServer.listen(port, () => console.log(`Server started on PORT: ${port}`));
