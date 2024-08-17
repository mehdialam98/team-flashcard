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
11. Only generate 10 flashcards.

    Remember to format your response as a JSON array of flashcards, where each flashcard is an object with a question and answer property.
    Return in the following JSON format:
        {
            "flashcards": [
                {
                    "front": "question",
                    "back": "answer"
                }
            ]
        }`

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data.prompt }
      ],
      response_format: { type: "json_object" }
    });

    const flashcards = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(flashcards.flashcards);


}