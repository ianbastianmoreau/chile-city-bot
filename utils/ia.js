const fetch = require("node-fetch");

const memory = new Map();

async function getAIResponse(userId, message) {

  if (!memory.has(userId)) {
    memory.set(userId, []);
  }

  const historial = memory.get(userId);

  historial.push({ role: "user", content: message });

  // limitar memoria
  if (historial.length > 6) historial.shift();

  try {
    const res = await fetch("https://api.ollama.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          {
            role: "system",
            content: "Eres un asistente realista, natural, amigable y chileno. Hablas como persona real, no como robot."
          },
          ...historial
        ]
      })
    });

    const data = await res.json();

    const respuesta = data.choices?.[0]?.message?.content || "No pude responder.";

    historial.push({ role: "assistant", content: respuesta });

    return respuesta;

  } catch (err) {
    console.error(err);
    return "❌ Error con IA.";
  }
}

module.exports = { getAIResponse };