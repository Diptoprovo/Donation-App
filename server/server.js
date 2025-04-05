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
import statsRouter from "./routes/statsRoutes.js";

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 4000;

connectDB();

// Configure CORS
const allowedOrigins = [process.env.FRONTEND_URL];
// const allowedOrigins = [];
// app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cors({
    origin: allowedOrigins, // Allow requests from your frontend
    credentials: true // If you're using cookies or authentication
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static("uploads"));

// Set up Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

// Store Socket.IO instance globally
app.set("socketio", io);

const users = new Map();

// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join", (userId) => {
        users.set(userId, socket.id);
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
    });

    socket.on("disconnect", () => {
        users.forEach((id, user) => {
            if (id === socket.id) {
                users.delete(user);
                console.log(`User ${user} disconnected`);
            }
        });
    });
});

// API Routes
app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.use("/api/auth", authRouter);
app.use("/api/donor", donorRouter);
app.use("/api/item", itemRouter);
app.use("/api/receiver", receiverRouter);
app.use("/api/request", requestRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/stats", statsRouter);

// ✅ Use httpServer.listen instead of app.listen
httpServer.listen(port, () => console.log(`Server started on PORT: ${port}`));