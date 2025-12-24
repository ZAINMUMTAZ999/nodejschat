"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const db_1 = require("./config/db");
const api_1 = __importDefault(require("./routes/api"));
const socketHandler_1 = require("./socket/socketHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000; // Better for deployment
// 1. Connect to DB
(0, db_1.connectDB)();
// --- ALLOWED DOMAINS LIST ---
const allowedOrigins = [
    "https://zainxcyberoid.vercel.app",
    "https://zainxcyberoid-git-main-zainmumtaz999s-projects.vercel.app",
    "https://zainxcyberoid-disvl38kn-zainmumtaz999s-projects.vercel.app",
    "http://localhost:3000" // Keep for local development
];
// 2. Middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) or if in allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
// 3. API Routes
app.use('/api', api_1.default);
// 4. Server & Socket Setup
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins, // Socket.io accepts an array of strings
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["websocket"], // Best for Railway/Vercel stability
});
// 5. Initialize Socket Logic
(0, socketHandler_1.setupSocket)(io);
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
