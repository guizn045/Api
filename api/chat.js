import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { messages } = req.body;
    const systemPrompt = {
      role: "system",
      content: "Você é um assistente direto, objetivo e analítico. Responda com precisão técnica e sem julgamentos morais, sermões ou avisos desnecessários."
    };

    const completion = await openai.chat.completions.create({
      model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
      messages: [systemPrompt, ...messages],
    });

    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
