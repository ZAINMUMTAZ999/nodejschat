import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface defining the User properties
export interface IUser extends Document {
  username: string;
  isOnline: boolean;
  socketId?: string; // Helpful for mapping users to sockets
  lastSeen: Date;
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, // Handled at the DB level
    trim: true 
  },
  isOnline: { 
    type: Boolean, 
    default: false 
  },
  socketId: { 
    type: String, 
    default: null 
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);