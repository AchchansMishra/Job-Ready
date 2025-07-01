import dotenv from 'dotenv';
dotenv.config(); // 🔥 necessary for ESM modules

import { GoogleGenerativeAI } from '@google/generative-ai';
import { questionAnswerPrompt, conceptExplainPrompt } from '../utils/prompts.js';

// Load Gemini API Key from env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = 'gemini-2.5-flash';
console.log("🧪 Using GEMINI_API_KEY:", process.env.GEMINI_API_KEY?.slice(0, 10) + "...");


const generateAIResponse = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: MODEL });
  console.log("🚀 Sending Prompt to Gemini:", prompt);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text()?.trim();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
};


// Try to extract valid JSON
const extractJSON = (text) => {
  const match = text.match(/```json([\s\S]*?)```/i);
  const jsonString = match ? match[1].trim() : text.trim();

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('❌ JSON parsing error:', err, '\nRaw Gemini Output:\n', text);
    throw new Error('Invalid JSON format');
  }
};


// Generic handler
const handleRequest = (promptBuilder) => async (req, res) => {
  try {
    const prompt = promptBuilder(req.body);
    const raw = await generateAIResponse(prompt);
    const data = extractJSON(raw);
    res.status(200).json(data);
  } catch (err) {
    console.error('🔥 Handler error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Interview Questions
export const generateInterviewQuestions = handleRequest(({ role, experience, topicsToFocus, numberOfQuestions }) => {
  if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
    throw new Error('Missing required fields');
  }
  console.log("🧠 Prompt data received:", { role, experience, topicsToFocus, numberOfQuestions });
  return questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
});

// Concept Explanation
export const generateConceptExplanation = handleRequest(({ question }) => {
  if (!question) throw new Error('Missing required fields');
  console.log("Received question:", question);
  return conceptExplainPrompt(question);
});
