require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const setupSocket = require('./socket/index');

// Import routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://cafeilluminati-fd89a.web.app',
      'https://cafeilluminati-adminpanel.web.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Make io accessible in routes
app.set('io', io);

// Setup socket event handlers
setupSocket(io);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://cafeilluminati-fd89a.web.app',
    'https://cafeilluminati-adminpanel.web.app',
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n☕ TableTalk server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
    console.log(`🌐 Customer app: https://cafeilluminati-fd89a.web.app`);
    console.log(`🔧 Admin panel:  https://cafeilluminati-adminpanel.web.app\n`);
  });
});
