import express from 'express';
import { User } from '../models/user';
import { Message } from '../models/message';

const router = express.Router();

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('username isOnline lastSeen');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get Unread Counts
router.get('/messages/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadStats = await Message.aggregate([
      { $match: { receiver: userId, status: { $in: ['sent', 'delivered'] } } },
      { $group: { _id: '$sender', count: { $sum: 1 } } }
    ]);
    res.json(unreadStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread stats' });
  }
});

export default router;