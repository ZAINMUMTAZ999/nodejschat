🚀 Cyberoid Real-Time Chat Engine (Backend)
          ---A robust, event-driven backend service built to power real-time communication. This engine handles stateful WebSocket connections, message persistence, and user synchronization.

🛠TECH STACK

          ---Runtime: Node.js

          ---Framework: Express.js

          ---Real-time: Socket.io

          ---Database: MongoDB

         ---Language: TypeScript (for type safety and maintainability)


📡SYSTEM ARCHITECTURE

         ---The backend serves as a central hub between multiple clients. It uses a Hybrid API/Socket approach:

         ---REST API: Handles heavy data fetching like initial user lists and message history, optimized with React Query on the frontend.


🪟WEBSOCKETS (Socket.io) :
         ---- Handles lightweight, high-frequency events like typing indicators, online status changes, and instant message delivery.

⚡KEY FEATURES 
         ---Bi-directional Communication: Instant message delivery via WebSocket.

         ---Stateful Presence: Tracks online/offline status in real-time.


         ---Persistence: Messages are stored in MongoDB with read/unread status tracking.

         ---Sound & Toast Logic: Backend triggers specific event types that the frontend uses to manage AudioContext notification sounds.


🧑🏻‍💻Installation & Setup
         1-Clone & Install

                  Bash
                  git clone https://github.com/ZAINMUMTAZ999/nodejschat.git
                  npm install
         2 - Environment Configuration Create a .env file in the root:
                  PORT=5000
                  MONGODB_URL=mongodb+srv://cyberoid:123456123456@cluster0.pixjhjf.mongodb.net/?appName=Cluster0
                  CLIENT_URL=http://localhost:3000
         3 - Development Mode
                 npm run dev 




## 📂 Project Structure

```text
src/
├── config/         # Database connection logic
├── models/         # Mongoose Schemas (User, Message)
├── routes/         # API Routes
├── socket/         # WebSocket Event Handlers
└── index.ts        # Entry point