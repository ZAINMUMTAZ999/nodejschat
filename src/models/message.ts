import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. UPDATE THE INTERFACE (This fixes the red underline in index.ts)
export interface IMessage extends Document {
  sender: string;
  receiver: string;
  content: string;
  status: 'sending' | 'sent' | 'delivered' | 'read'; // <--- THIS WAS MISSING
  createdAt: Date;
  updatedAt: Date;
}

// 2. UPDATE THE SCHEMA (This saves it to the DB)
const MessageSchema: Schema = new Schema({
  sender: { 
    type: String, 
    required: true 
  },
  receiver: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['sending', 'sent', 'delivered', 'read'],
    default: 'sent'
  }
}, { 
  timestamps: true 
});

export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);