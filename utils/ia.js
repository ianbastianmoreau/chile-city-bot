const memory = {};
const cooldown = {};

// 🎭 PERSONALIDADES
const personalidades = {
  normal: {
    tono: "amigable",
    emojis: true
  },
  serio: {
    tono: "formal",
    emojis: false
  },
  troll: {
    tono: "sarcastico",
    emojis: true
  }
};

// 🧠 RESPUESTAS BASE
const base = {
  saludo: [
    "Hola, ¿en qué te ayudo?",
    "Buenas, dime qué necesitas",
    "Hey, aquí estoy"
  ],
  duda: [
    "Interesante... explícate más",
    "Necesito más detalles",
    "Cuéntame mejor eso"
  ],
  enojo: [
    "Tranqui 😅, dime qué pasó",
    "Calma, lo resolvemos",
    "No te enojes, explícame bien"
  ],
  random: [
    "No entendí bien eso",
    "Explícalo de otra forma",
    "Dame más contexto"
  ]
};

// 🔍 DETECTAR INTENCIÓN
function detectarIntento(msg) {
  if (msg.includes("hola") || msg.includes("buenas")) return "saludo";
  if (msg.includes("?") || msg.includes("que") || msg.includes("como")) return "duda";
  if (msg.includes("weon") || msg.includes("ctm") || msg.includes("idiota")) return "enojo";
  return "random";
}

// 🎲 RESPUESTA INTELIGENTE
function generarRespuesta(tipo, userMem) {
  let lista = base[tipo] || base.random;

  let filtradas = lista.filter(r => r !== userMem.lastResponse);
  if (filtradas.length === 0) filtradas = lista;

  return filtradas[Math.floor(Math.random() * filtradas.length)];
}

// 🧠 FUNCIÓN PRINCIPAL
async function getAIResponse(userId, msg) {
  msg = msg.toLowerCase();

  // ⏱️ COOLDOWN
  if (cooldown[userId]) return null;
  cooldown[userId] = true;
  setTimeout(() => delete cooldown[userId], 2500);

  // 📦 CREAR MEMORIA
  if (!memory[userId]) {
    memory[userId] = {
      lastMessage: null,
      lastResponse: null,
      personalidad: "normal",
      historial: []
    };
  }

  const userMem = memory[userId];

  // ❌ evitar repetir mensaje
  if (userMem.lastMessage === msg) {
    return "🤨 Ya dijiste eso...";
  }

  userMem.lastMessage = msg;

  // 📚 guardar historial (máx 5)
  userMem.historial.push(msg);
  if (userMem.historial.length > 5) userMem.historial.shift();

  // 🧠 detectar intención
  const tipo = detectarIntento(msg);

  let respuesta = generarRespuesta(tipo, userMem);

  // 🎭 PERSONALIDAD
  const personalidad = personalidades[userMem.personalidad];

  if (personalidad.tono === "sarcastico") {
    respuesta = "😏 " + respuesta;
  }

  if (personalidad.tono === "formal") {
    respuesta = respuesta.replace("Hola", "Buenas tardes");
  }

  if (personalidad.emojis === false) {
    respuesta = respuesta.replace(/[^\w\s]/gi, "");
  }

  userMem.lastResponse = respuesta;

  return respuesta;
}

// 🔧 CAMBIAR PERSONALIDAD
function setPersonality(userId, tipo) {
  if (!memory[userId]) return;
  memory[userId].personalidad = tipo;
}

module.exports = { getAIResponse, setPersonality };