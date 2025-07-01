import dotenv from 'dotenv';
dotenv.config();
console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "LOADED ✅" : "MISSING ❌");

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import {
  generateInterviewQuestions,
  generateConceptExplanation,
} from './controllers/aiController.js';
import { protect } from './middlewares/authMiddleware.js';

import fs from 'fs';

console.log("🔍 .env exists:", fs.existsSync('./.env'));



const app = express();

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to handle CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Connect DB
connectDB();

// Body parser middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);

// AI routes
app.use('/api/ai/generate-Questions', protect, generateInterviewQuestions);
app.use('/api/ai/generate-explanation', protect, generateConceptExplanation);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
