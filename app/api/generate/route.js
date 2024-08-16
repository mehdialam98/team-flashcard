import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = 
`You are a flashcard creator. Your task is to generate concise and effective flashcards based on the information provided. Each flashcard should have a clear question on one side and a concise answer on the other. Follow these guidelines:

1. Create clear and specific questions for the front of the flashcard.
2. Provide accurate and informative answers  for the back of the flashcard.
3. Use simple language to ensure clarity and ease of understanding.
4. Avoid overly complex or lengthy explanations in the answers.
5. Focus on one main idea per flashcard.
6. When appropriate, use mnemonics or memory aids to enhance retention.
7. Ensure that the content is factually correct and up-to-date.
8. Vary the types of questions (e.g., definitions, examples, comparisons) to promote comprehensive learning.
9. Tailor the difficulty level to the user's specified knowledge level.
10. When given a topic, create a balanced set of flashcards that cover its main aspects.

    Remember to format your response as a JSON array of flashcards, where each flashcard is an object with a question and answer property.
    Return in the following format:
    [
        {
            "question": "What is the capital of France?",
            "answer": "Paris"
        }
    ]`;



export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { topic } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",  // Changed from "gpt-4o" to "gpt-4"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create flashcards for the topic: ${topic}` }
      ],
    });

    // Parse the content as JSON
    const flashcards = JSON.parse(completion.choices[0].message.content);

    // Before parsing, log the data to see what you're receiving
    console.log("Data received:", completion.choices[0].message.content);

    // Add a try-catch block around your JSON.parse call
    try {
      const parsedData = JSON.parse(completion.choices[0].message.content);
      return NextResponse.json({ flashcards: parsedData });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Attempted to parse:", completion.choices[0].message.content);
      return NextResponse.json({ error: 'Failed to parse flashcards' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate or parse flashcards' }, { status: 500 });
  }
}