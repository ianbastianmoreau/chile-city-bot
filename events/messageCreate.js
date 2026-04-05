const memory = new Map();

module.exports = {
  name: "messageCreate",
  async execute(message, client) {

    if (message.author.bot) return;

    const prefix = "ch!";

    // =====================
    // 📌 PREFIX COMMANDS
    // =====================
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.prefixCommands.get(commandName);

      if (!command) return;

      try {
        await command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("❌ Error ejecutando el comando.");
      }
    }

    // =====================
    // 🧠 IA PRO
    // =====================
    if (message.mentions.has(client.user)) {

      const userId = message.author.id;
      const msg = message.content.toLowerCase();

      // 📌 MEMORIA DEL USUARIO
      if (!memory.has(userId)) {
        memory.set(userId, []);
      }

      const userMemory = memory.get(userId);

      userMemory.push(msg);

      if (userMemory.length > 5) {
        userMemory.shift(); // mantiene últimas 5
      }

      const contexto = userMemory.join(" | ");

      const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

      // =====================
      // RESPUESTAS INTELIGENTES
      // =====================
      let respuesta = "";

      if (msg.includes("hola") || msg.includes("buenas")) {
        respuesta = random([
          `👋 Hola ${message.author}, ¿qué necesitas en Chile City Roleplay?`,
          `Buenas ${message.author} 😎 dime en qué te ayudo.`,
          `Hola ${message.author}, estoy activo para ayudarte.`
        ]);
      }

      else if (msg.includes("entrar")) {
        respuesta = random([
          "Para ingresar debes esperar una apertura o usar el código **ChileCity** dentro del juego.",
          "El servidor abre por anuncios, mantente atento. Código: **ChileCity**.",
          "Cuando haya apertura podrás entrar con el código **ChileCity**."
        ]);
      }

      else if (msg.includes("staff")) {
        respuesta = random([
          "Puedes postular a staff cuando se abran cupos o usar **/calificar**.",
          "El staff se gestiona por postulaciones, revisa los canales.",
          "Si tuviste una experiencia con staff puedes calificarlo con **/calificar**."
        ]);
      }

      else if (msg.includes("bug") || msg.includes("error")) {
        respuesta = random([
          "Puedes reportar bugs usando **/bugs** con pruebas.",
          "Recuerda adjuntar imagen al reportar un bug.",
          "Usa **/bugs** para que el staff pueda revisarlo."
        ]);
      }

      else if (msg.includes("gracias")) {
        respuesta = random([
          "😎 Para eso estoy.",
          "Un gusto ayudarte.",
          "Cuando necesites algo más, aquí estoy."
        ]);
      }

      else if (msg.includes("quien eres")) {
        respuesta = random([
          "Soy el asistente oficial de Chile City Roleplay 🤖",
          "Estoy aquí para ayudarte con todo lo del servidor.",
          "Soy el bot encargado de asistencia y soporte."
        ]);
      }

      else {

        // 🧠 RESPUESTA CONTEXTUAL (CLAVE PRO)
        if (contexto.includes("entrar")) {
          respuesta = "Si sigues con dudas sobre cómo entrar, recuerda: debes esperar apertura o usar el código **ChileCity**.";
        } else if (contexto.includes("staff")) {
          respuesta = "Sobre staff, revisa postulaciones o usa **/calificar** si es evaluación.";
        } else {
          respuesta = random([
            "🤖 No entendí completamente, pero puedo ayudarte si me das más detalles.",
            "Explícame mejor lo que necesitas y te ayudo.",
            "Estoy para ayudarte con el servidor, intenta ser más específico."
          ]);
        }
      }

      return message.reply(respuesta);
    }
  }
};