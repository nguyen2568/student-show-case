require('dotenv').config({ path: ['.env.local', '.env'] })
const path = require('path');

const { Server } = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
require('./bridge/mqttBridge').createMqttBridge(io);

const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173","http://100.110.246.71:5173","https://recyclebox.rocks","https://www.recyclebox.rocks"],
  credentials: true
}));

// Middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Removed all route and middleware logic to separate files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const shareRoutes = require('./routes/shareRoutes');

// Use routes
app.use('/api/auth', authRoutes.router);
app.use('/api/user', userRoutes);
app.use('/share', shareRoutes);

app.get('/api', (req, res) => {res.json({ message: 'API is running v3'})});
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});