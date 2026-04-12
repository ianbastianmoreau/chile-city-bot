const memory = new Map();

async function getAIResponse(userId, message) {

  if (!memory.has(userId)) memory.set(userId, []);

  const historial = memory.get(userId);

  historial.push(message);

  if (historial.length > 15) historial.shift();

  // RESPUESTA MÁS NATURAL
  let respuesta;

  if (message.includes("hola")) {
    respuesta = "👋 Hola, ¿en qué puedo ayudarte hoy?";
  } else if (message.includes("abrir")) {
    respuesta = "🚀 La apertura depende de votos o staff.";
  } else {
    respuesta = "💬 Te leo… dime más detalles.";
  }

  return respuesta;
}

module.exports = { getAIResponse };