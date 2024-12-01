// src/app/api/humanizer/route.ts

import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { text, tone } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }

    const validTone = validateTone(tone);
    const prompt = generatePrompt(text, validTone);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7, // Balances creativity and consistency
    });

    const humanizedText = postProcess(response.choices[0].message.content.trim());

    return NextResponse.json({ humanizedText });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process the request.' },
      { status: 500 }
    );
  }
}

// Validate and default the tone input
function validateTone(tone: string | undefined): string {
  const validTones = ['casual', 'professional', 'conversational', 'formal'];
  return validTones.includes(tone ?? '') ? tone! : 'natural';
}

// Generate a refined prompt with few-shot examples
function generatePrompt(text: string, tone: string) {
  const examples = {
    casual: `
Example:
Original: "Exercise is essential for maintaining physical and mental health."
Casual: "Staying active is key to feeling good physically and mentally."
`,
    professional: `
Example:
Original: "The project’s success depends on collaboration and proper planning."
Professional: "Effective collaboration and strategic planning are essential for the project’s success."
`,
    conversational: `
Example:
Original: "A balanced diet includes proteins, carbohydrates, and healthy fats."
Conversational: "You gotta have some carbs, proteins, and healthy fats to keep things balanced!"
`,
    formal: `
Example:
Original: "It is crucial to adhere to guidelines for optimal results."
Formal: "Strict adherence to the guidelines is imperative to achieve optimal results."
`,
  };

  const toneDescription = {
    casual: 'Rewrite this text to sound casual and friendly.',
    professional: 'Rewrite this text to maintain professionalism and precision.',
    conversational: 'Rewrite this text to sound like a natural conversation.',
    formal: 'Rewrite this text to be structured and polished.',
    natural: 'Rewrite this text to maintain its original meaning and clarity.',
  };

  const example = examples[tone] || '';
  const description = toneDescription[tone] || toneDescription['natural'];

  return `${description} Make sure the meaning stays intact, and the tone feels appropriate. 

${example}

Original Text:
"${text}"
  `;
}

// Post-process output to correct any formatting issues
function postProcess(text: string) {
  return text
    .replace(/- /g, '\n- ') // Ensure bullet points are formatted correctly
    .replace(/\s{2,}/g, ' ') // Remove extra spaces
    .trim();
}
