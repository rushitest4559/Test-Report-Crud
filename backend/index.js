// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import testreportRoutes from './routes/TestReportRoutes.js'

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json

// CORS setup
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Routes
app.use('/api/testreports', testreportRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB Connection + Server Start
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});



