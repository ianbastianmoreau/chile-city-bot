const memory = {};

const respuestas = {
  saludo: [
    "👋 Hola bro, ¿qué necesitas?",
    "Buenas 😎 ¿en qué te ayudo?",
    "Hola, dime 👀"
  ],
  estado: [
    "Todo tranquilo por acá 😎",
    "Aquí activo, ¿y tú?",
    "Todo chill, dime"
  ],
  default: [
    "🤖 Interesante... cuéntame más.",
    "Hmm, explícate mejor 👀",
    "No te sigo mucho, dime más claro."
  ]
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectar(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("hola")) return "saludo";
  if (msg.includes("que pasa") || msg.includes("q pasa")) return "estado";

  return "default";
}

async function getAIResponse(userId, message) {

  if (!memory[userId]) memory[userId] = [];

  // guardar memoria
  memory[userId].push(message);
  if (memory[userId].length > 5) memory[userId].shift();

  const tipo = detectar(message);

  return random(respuestas[tipo]);
}

module.exports = { getAIResponse };