export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY, // Hidden securely in Vercel!
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          system: SYSTEM,
          messages: req.body.messages
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error communicating with AI');
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }