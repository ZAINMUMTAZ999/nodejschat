import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import "dotenv/config";
import { connectDB } from './config/db';
import apiRoutes from './routes/api';
import { setupSocket } from './socket/socketHandler';

const app = express();
const PORT =  5000;

// 1. Connect to DB
connectDB();

// 2. Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// 3. API Routes
app.use('/api', apiRoutes);

// 4. Server & Socket Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"], credentials: true },
  transports: ["websocket"],
});

// 5. Initialize Socket Logic
setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});