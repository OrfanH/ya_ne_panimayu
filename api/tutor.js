const GEMINI_PRIMARY = 'gemini-2.5-flash';
const GEMINI_FALLBACK = 'gemini-2.5-flash-lite';

async function callGemini(apiKey, model, systemPrompt, messages) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    return { error: 'rate_limit' };
  }

  if (!res.ok) {
    const text = await res.text();
    return { error: 'api_error', message: `Gemini ${res.status}: ${text.slice(0, 200)}` };
  }

  const data = await res.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return { reply };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'api_error', message: 'API key not configured' });
  }

  const { messages, systemPrompt, model } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'api_error', message: 'messages array required' });
  }

  const chosenModel = model || GEMINI_PRIMARY;
  const prompt = systemPrompt || '';

  const result = await callGemini(apiKey, chosenModel, prompt, messages);

  if (result.error === 'rate_limit' && chosenModel === GEMINI_PRIMARY) {
    const fallbackResult = await callGemini(apiKey, GEMINI_FALLBACK, prompt, messages);
    return res.status(200).json(fallbackResult);
  }

  return res.status(200).json(result);
}
