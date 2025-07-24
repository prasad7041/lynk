require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./route');
const setupWebSocket = require('./websocket'); // 👈 Import WS handler

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use('/user', route);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Setup WebSocket separately
setupWebSocket(server);

const PORT = process.env.PORT || 5501;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🛰️ WebSocket ready at ws://localhost:${PORT}`);
});
