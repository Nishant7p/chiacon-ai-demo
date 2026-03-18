export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM = `You are a senior AI consultant at Chiacon, an IT services firm specialising in Analytics, RPA, QA, and Project Delivery.
Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text.
{
  "summary": "2-3 sentences restating the core business problem precisely. Reference the industry/department context if provided.",
  "opportunities": [
    "Opportunity 1: one sentence on what the solution is, one sentence on how it addresses this specific problem.",
    "Opportunity 2: same format.",
    "Opportunity 3: same format."
  ],
  "impact": "2-3 sentences on realistic business outcomes specific to this problem. Reference the industry, size, and department context. Be grounded, not generic."
}
For follow-ups: refine and update the JSON based on the new question. Keep all three keys populated.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key is missing in Vercel settings!");

    // 1. Translate the messages from your frontend into Google's format
    const geminiMessages = req.body.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // 2. Call the free Google Gemini model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: geminiMessages,
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Error communicating with AI');

    // 3. Send it back in the exact format your existing frontend HTML expects!
    const generatedText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ content: [{ text: generatedText }] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
