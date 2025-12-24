import { Server, Socket } from 'socket.io';
import { User } from '../models/user';
import { Message } from '../models/message';

// Memory Map for User -> SocketID
const connectedUsers = new Map<string, string>();

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    
    // 1. JOIN
    socket.on('join', async (username: string) => {
      connectedUsers.set(username, socket.id);
    //   console.log(`⚡ ${username} joined (${socket.id})`);
      
      socket.broadcast.emit('userStatusChange', { username, status: 'online' });
      socket.emit('onlineUsersList', Array.from(connectedUsers.keys()));

      await User.findOneAndUpdate(
        { username },
        { isOnline: true, socketId: socket.id, lastSeen: new Date() },
        { upsert: true, new: true }
      );
    });

    // 2. SEND MESSAGE
    socket.on('sendMessage', async (data) => {
      try {
        const { to, from, message } = data;
        const recipientSocketId = connectedUsers.get(to);
        const messageStatus = recipientSocketId ? 'delivered' : 'sent';

        const newMessage = await Message.create({
          sender: from, receiver: to, content: message, status: messageStatus 
        });

        socket.emit('messageSent', newMessage);

        if (recipientSocketId) {
          io.to(recipientSocketId).emit('receiveMessage', newMessage);
        }
      } catch (e) { console.error('Message error:', e); }
    });

    // 3. LOAD HISTORY
    socket.on('loadChatHistory', async ({ user1, user2 }) => {
      try {
        const history = await Message.find({
          $or: [{ sender: user1, receiver: user2 }, { sender: user2, receiver: user1 }]
        }).sort({ createdAt: 1 });

        socket.emit('chatHistoryLoaded', history);

        // Mark as Read logic
        await Message.updateMany(
          { sender: user2, receiver: user1, status: { $in: ['sent', 'delivered'] } },
          { $set: { status: 'read' } }
        );
      } catch (e) { console.error('History error:', e); }
    });

    // 4. TYPING
    socket.on('typing', (data) => {
      const recipientSocketId = connectedUsers.get(data.to);
      if (recipientSocketId) io.to(recipientSocketId).emit('userTyping', data);
    });

    // 5. DISCONNECT
    socket.on('disconnect', async () => {
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
        await User.findOneAndUpdate({ username: disconnectedUser }, { isOnline: false, lastSeen: new Date() });
      }
    });
  });
};