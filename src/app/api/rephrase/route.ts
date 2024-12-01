import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Please provide text to rewrite.' }, { status: 400 });
    }

    // Generate a different prompt based on the selected mode
    let prompt = `Rewrite this text: ${text}`; // Default prompt for "Normal" mode

    switch (mode) {
      case 'creative':
        prompt = `Rewrite this text creatively: ${text}`;
        break;
      case 'formal':
        prompt = `Rewrite this text formally: ${text}`;
        break;
      case 'concise':
        prompt = `Rewrite this text concisely: ${text}`;
        break;
      case 'normal':
      default:
        prompt = `Rewrite this text: ${text}`; // Use normal mode by default
        break;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const rephrasedText = completion.choices[0].message.content.trim();
    return NextResponse.json({ rephrasedText });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to the rephrasing service.' },
      { status: 500 }
    );
  }
}
