// index.js
global.fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer'
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs'
import streamifier from 'streamifier'
import FormData from 'form-data'
// import fetch from 'node-fetch';
import testreportRoutes from './routes/TestReportRoutes.js'

dotenv.config();

const app = express();
const upload = multer();

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

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file received from frontend.");
      return res.status(400).json({ error: "No file received" });
    }

    console.log("✅ Received file from frontend:");
    console.log({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferType: typeof req.file.buffer,
    });

    // Optional: Save file locally for debug
    fs.writeFileSync("received-debug.pdf", req.file.buffer);
    console.log("📁 File saved as 'received-debug.pdf'");

    // Prepare form-data for Gofile.io
    const formData = new FormData();
    formData.append("file", streamifier.createReadStream(req.file.buffer), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log("📤 Uploading to GoFile.io...");

    const response = await fetch("https://store1.gofile.io/uploadFile", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await response.json();
    console.log("✅ Gofile.io Response:", data);

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
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



