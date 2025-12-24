"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
const serverless_http_1 = __importDefault(require("serverless-http"));
const db_1 = require("../../src/config/db");
const api_1 = __importDefault(require("../../src/routes/api"));
const socketHandler_1 = require("../../src/socket/socketHandler");
const app = (0, express_1.default)();
// 1. Connect to DB
(0, db_1.connectDB)();
// 2. Middleware
app.use((0, cors_1.default)({ origin: "http://zainXcyberoid.vercel.app", credentials: true }));
app.use(express_1.default.json());
const router = express_1.default.Router();
router.use('/api', api_1.default);
app.use('/.netlify/functions/api', router); // Setup for Netlify path
// --- SOCKET IO SETUP (Note: Won't work on Netlify Prod) ---
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
    transports: ["websocket"],
});
(0, socketHandler_1.setupSocket)(io);
// -----------------------------------------------------------
// 4. Local Development vs Production Export
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`);
    });
}
// 5. Export the handler for Netlify
exports.handler = (0, serverless_http_1.default)(app);
