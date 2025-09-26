import dotenv from 'dotenv';
dotenv.config(); 

import { GoogleGenerativeAI } from '@google/generative-ai';
import { questionAnswerPrompt, conceptExplainPrompt } from '../utils/prompts.js';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = 'gemini-2.5-flash';

const generateAIResponse = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: MODEL });
  console.log(" Sending Prompt to Gemini:", prompt);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text()?.trim();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
};




function extractJSON(rawText) {
  try {
    return JSON.parse(rawText);
  } catch (err1) {
    const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch (err2) {
        console.warn(" Failed to parse inside code block:", err2.message);
      }
    }
    const firstJsonBlock = rawText.match(/\{[\s\S]*\}/);
    if (firstJsonBlock) {
      try {
        return JSON.parse(firstJsonBlock[0]);
      } catch (err3) {
        console.warn(" Fallback JSON parse failed:", err3.message);
      }
    }

    console.error(" Full Raw Gemini Output:\n", rawText);
    throw new Error("Invalid JSON format in Gemini response");
  }
}


const handleRequest = (promptBuilder) => async (req, res) => {
  try {
    const prompt = promptBuilder(req.body);
    const raw = await generateAIResponse(prompt);
    const data = extractJSON(raw);
    res.status(200).json(data);
  } catch (err) {
    console.error(' Handler error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const generateInterviewQuestions = handleRequest(({ role, experience, topicsToFocus, numberOfQuestions }) => {
  if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
    throw new Error('Missing required fields');
  }
  console.log(" Prompt data received:", { role, experience, topicsToFocus, numberOfQuestions });
  return questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
});

export const generateConceptExplanation = handleRequest(({ question }) => {
  if (!question) throw new Error('Missing required fields');
  console.log("Received question:", question);
  return conceptExplainPrompt(question);
});

