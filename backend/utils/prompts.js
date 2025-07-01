export const questionAnswerPrompt = (role, experience, topics, n) =>
  `You are an interview assistant. Respond in JSON format only.

Task:
- Role: ${role}
- Experience: ${experience} years
- Topics: ${topics}
- Generate ${n} interview questions and clear beginner-friendly answers.

Respond ONLY with a valid JSON array like:
[
  {"question": "Q1", "answer": "A1"},
  {"question": "Q2", "answer": "A2"}
]
`;

export const conceptExplainPrompt = (question) =>
  `You are an AI tutor. Explain the concept below clearly in Markdown. Respond in pure JSON.

Concept: "${question}"

Format:
{
  "title": "A short title",
  "explanation": "A detailed explanation (markdown supported)"
}

Respond ONLY with that JSON object.
`;
