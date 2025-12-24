import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import "dotenv/config";
import { connectDB } from './config/db';
import apiRoutes from './routes/api';
import { setupSocket } from './socket/socketHandler';

const app = express();
const PORT = process.env.PORT || 5000; // Better for deployment

// 1. Connect to DB
connectDB();

// --- ALLOWED DOMAINS LIST ---
const allowedOrigins = [
  "https://zainxcyberoid.vercel.app",
  "https://zainxcyberoid-git-main-zainmumtaz999s-projects.vercel.app",
  "https://zainxcyberoid-disvl38kn-zainmumtaz999s-projects.vercel.app",
  "http://localhost:3000" // Keep for local development
];

// 2. Middleware
app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));

app.use(express.json());

// 3. API Routes
app.use('/api', apiRoutes);

// 4. Server & Socket Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: allowedOrigins, // Socket.io accepts an array of strings
    methods: ["GET", "POST"], 
    credentials: true 
  },
  transports: ["websocket"], // Best for Railway/Vercel stability
});

// 5. Initialize Socket Logic
setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});