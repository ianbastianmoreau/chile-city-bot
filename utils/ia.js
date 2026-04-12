const memory = {};

const respuestas = {
  saludo: [
    "👋 Hola, ¿en qué te ayudo?",
    "👋 ¡Buenas! ¿Qué necesitas?",
    "👋 Hola, dime en qué puedo ayudarte"
  ],
  pregunta: [
    "🤔 Interesante... cuéntame más.",
    "👀 Explícate un poco más",
    "🧠 Dame más detalles para ayudarte mejor"
  ],
  random: [
    "😅 No entendí mucho eso, ¿puedes explicar mejor?",
    "🤖 Hmm... intenta decirlo de otra forma",
    "🧠 Estoy aprendiendo, dame más contexto"
  ]
};

// 🔁 evitar repetir
function getRandom(arr, last) {
  let filtered = arr.filter(r => r !== last);
  if (filtered.length === 0) filtered = arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

async function getAIResponse(userId, msg) {
  msg = msg.toLowerCase();

  if (!memory[userId]) {
    memory[userId] = {
      lastResponse: null,
      lastMessage: null
    };
  }

  const userMem = memory[userId];

  // ❌ evitar spam mismo mensaje
  if (userMem.lastMessage === msg) {
    return "🤨 Ya dijiste eso...";
  }

  userMem.lastMessage = msg;

  let respuesta;

  // 🧠 lógica básica
  if (msg.includes("hola") || msg.includes("buenas")) {
    respuesta = getRandom(respuestas.saludo, userMem.lastResponse);
  }
  else if (msg.includes("?") || msg.includes("que") || msg.includes("por que")) {
    respuesta = getRandom(respuestas.pregunta, userMem.lastResponse);
  }
  else {
    respuesta = getRandom(respuestas.random, userMem.lastResponse);
  }

  // guardar última respuesta
  userMem.lastResponse = respuesta;

  return respuesta;
}

module.exports = { getAIResponse };