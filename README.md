# 📡 Real-Time Chat Backend

The  server-side application for the Real-Time Chat system. It handles **WebSocket connections** via Socket.io and provides **REST APIs** for persistent data.

## 🛠️ Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Real-Time:** Socket.io
* **Database:** MongoDB + Mongoose
* **Language:** TypeScript
* **Deployed:** Netlify

## 📂 Project Structure

```text
src/
├── config/         # Database connection logic
├── models/         # Mongoose Schemas (User, Message)
├── routes/         # API Routes
├── socket/         # WebSocket Event Handlers
└── index.ts        # Entry point