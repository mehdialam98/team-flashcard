import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a flashcard creator. Your task is to generate concise and effective flashcards based on the information provided. Each flashcard should have a clear question on one side and a concise answer on the other. Follow these guidelines:

1. Create clear and specific questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Use simple language to ensure clarity and ease of understanding.
4. Avoid overly complex or lengthy explanations in the answers.
5. Focus on one main idea per flashcard.
6. When appropriate, use mnemonics or memory aids to enhance retention.
7. Ensure that the content is factually correct and up-to-date.
8. Vary the types of questions (e.g., definitions, examples, comparisons) to promote comprehensive learning.
9. Tailor the difficulty level to the user's specified knowledge level.
10. When given a topic, create a balanced set of flashcards that cover its main aspects.
11. Only generate 10 flashcards.

Return your response as a JSON string with the following format:
{
  "flashcards": [
    {
      "front": "Question on the front of the flashcard",
      "back": "One word answer on the back of the flashcard"
    },
    // ... more flashcards
  ]
}`;

export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Make sure this is set in your environment variables
  });

  try {
    const data = await req.json();
    console.log("Received data:", data);

    if (!data.prompt) {
      throw new Error("No prompt provided");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed from "gpt-4" to "gpt-3.5-turbo"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data.prompt }
      ],
      // Removed the response_format parameter
    });

    console.log("OpenAI API response:", completion.choices[0].message.content);

    // Parse the content as JSON
    const flashcards = JSON.parse(completion.choices[0].message.content);
    
    if (!flashcards.flashcards || !Array.isArray(flashcards.flashcards)) {
      throw new Error("Invalid response format from OpenAI API");
    }

    return NextResponse.json(flashcards.flashcards);

  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}