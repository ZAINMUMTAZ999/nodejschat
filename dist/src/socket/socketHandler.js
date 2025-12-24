"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const user_1 = require("../models/user");
const message_1 = require("../models/message");
// Memory Map for User -> SocketID
const connectedUsers = new Map();
const setupSocket = (io) => {
    io.on('connection', (socket) => {
        // 1. JOIN
        socket.on('join', (username) => __awaiter(void 0, void 0, void 0, function* () {
            connectedUsers.set(username, socket.id);
            //   console.log(`⚡ ${username} joined (${socket.id})`);
            socket.broadcast.emit('userStatusChange', { username, status: 'online' });
            socket.emit('onlineUsersList', Array.from(connectedUsers.keys()));
            yield user_1.User.findOneAndUpdate({ username }, { isOnline: true, socketId: socket.id, lastSeen: new Date() }, { upsert: true, new: true });
        }));
        // 2. SEND MESSAGE
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { to, from, message } = data;
                const recipientSocketId = connectedUsers.get(to);
                const messageStatus = recipientSocketId ? 'delivered' : 'sent';
                const newMessage = yield message_1.Message.create({
                    sender: from, receiver: to, content: message, status: messageStatus
                });
                socket.emit('messageSent', newMessage);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receiveMessage', newMessage);
                }
            }
            catch (e) {
                console.error('Message error:', e);
            }
        }));
        // 3. LOAD HISTORY
        socket.on('loadChatHistory', (_a) => __awaiter(void 0, [_a], void 0, function* ({ user1, user2 }) {
            try {
                const history = yield message_1.Message.find({
                    $or: [{ sender: user1, receiver: user2 }, { sender: user2, receiver: user1 }]
                }).sort({ createdAt: 1 });
                socket.emit('chatHistoryLoaded', history);
                // Mark as Read logic
                yield message_1.Message.updateMany({ sender: user2, receiver: user1, status: { $in: ['sent', 'delivered'] } }, { $set: { status: 'read' } });
            }
            catch (e) {
                console.error('History error:', e);
            }
        }));
        // 4. TYPING
        socket.on('typing', (data) => {
            const recipientSocketId = connectedUsers.get(data.to);
            if (recipientSocketId)
                io.to(recipientSocketId).emit('userTyping', data);
        });
        // 5. DISCONNECT
        socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
            let disconnectedUser = '';
            for (const [user, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUser = user;
                    connectedUsers.delete(user);
                    break;
                }
            }
            if (disconnectedUser) {
                console.log(`⚠️ ${disconnectedUser} disconnected`);
                io.emit('userStatusChange', { username: disconnectedUser, status: 'offline' });
                yield user_1.User.findOneAndUpdate({ username: disconnectedUser }, { isOnline: false, lastSeen: new Date() });
            }
        }));
    });
};
exports.setupSocket = setupSocket;
