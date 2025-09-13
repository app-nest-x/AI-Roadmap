import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);
export async function POST(request) {
  try {
    const { career } = await request.json();
    if (!career || typeof career !== 'string') {
      return Response.json(
        { error: 'Career field is required and must be a string' },
        { status: 400 }
      );
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a career mentor AI. Create a career roadmap for ${career}.
The roadmap must be step-by-step, formatted in JSON:
{
  "career": "Career Name",
  "steps": [
    {"title": "Step 1", "description": "Explain in 1–2 sentences"},
    {"title": "Step 2", "description": "Explain in 1–2 sentences"}
  ]
}
Keep it simple, beginner-friendly, and limited to 5–8 steps.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    let roadmap;
    try {
      roadmap = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
      return Response.json(
        { error: 'Invalid response format from AI' },
        { status: 500 }
      );
    }
    if (!roadmap.career || !Array.isArray(roadmap.steps)) {
      return Response.json(
        { error: 'Invalid roadmap structure' },
        { status: 500 }
      );
    }
    const validSteps = roadmap.steps
      .filter(step => step.title && step.description)
      .slice(0, 8);
    if (validSteps.length < 3) {
      return Response.json(
        { error: 'Insufficient valid steps in roadmap' },
        { status: 500 }
      );
    }
    roadmap.steps = validSteps;
    return Response.json(roadmap);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}