// src/app/api/grammar/route.ts

import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided.' },
        { status: 400 }
      );
    }

    const prompt = `Correct the grammar in the following text:\n\n"${text}"`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const correctedText = response.choices[0].message.content.trim();

    return NextResponse.json({ originalText: text, correctedText });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API Error:', error.message);
    }
    return NextResponse.json(
      { error: 'Failed to process the request.' },
      { status: 500 }
    );
  }
}
