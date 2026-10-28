export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { messages } = req.body;
    
    // Pega a última mensagem enviada por si
    const lastMessage = messages[messages.length - 1].content;

    // Usando uma API pública de inferência de código aberto sem filtros restritivos
    const response = await fetch("https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: lastMessage,
        parameters: { max_new_tokens: 500, return_full_text: false }
      })
    });

    const data = await response.json();

    let replyText = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      replyText = data[0].generated_text;
    } else if (data.generated_text) {
      replyText = data.generated_text;
    } else {
      replyText = data.error || "O modelo está a carregar. Tente novamente em alguns segundos.";
    }

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    return res.status(500).json({ reply: "Erro interno: " + error.message });
  }
}
