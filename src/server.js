// import dns from 'dns'
// dns.setServers(['8.8.8.8', '1.1.1.1'])
// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import socketHandler from "./socket/socket.js";

// const app = express();
// app.use(cors());
// app.use(express.json());

// connectDB();

// app.use("/api/auth", authRoutes);
// app.use("/api/chats", chatRoutes);
// app.use("/api/messages", messageRoutes);

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

// socketHandler(io);

// const PORT = process.env.PORT
// server.listen(PORT, () => console.log(`Server is running on ${PORT} Port.`));

import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import socketHandler from "./socket/socket.js";

const app = express();

const allowedOrigins = process.env.CLIENT_URLS.split(",");

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on ${PORT} Port.`));