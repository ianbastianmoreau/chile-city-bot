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
    // 🧠 IA GRATIS MEJORADA
    // =====================
    if (message.mentions.has(client.user)) {

      const msg = message.content.toLowerCase();

      const respuestas = {
        saludo: [
          `👋 Hola ${message.author}, ¿en qué puedo ayudarte en Chile City Roleplay?`,
          `¡Hola ${message.author}! 😊 dime qué necesitas.`,
          `Buenas ${message.author} 👀 estoy aquí para ayudarte.`
        ],
        entrar: [
          "Debes esperar una apertura del servidor o usar el código **ChileCity** dentro del juego.",
          "El acceso se habilita cuando el servidor abre, mantente atento a los anuncios.",
          "Cuando el servidor esté abierto podrás ingresar con el código **ChileCity**."
        ],
        staff: [
          "Puedes calificar staff usando **/calificar** o postular cuando haya vacantes.",
          "El equipo staff se gestiona mediante postulaciones, revisa los canales correspondientes.",
          "Si tuviste una experiencia con staff puedes usar **/calificar**."
        ],
        bugs: [
          "Puedes reportar bugs usando **/bugs** con pruebas.",
          "Mientras más detalles entregues, más rápido se solucionará el problema.",
          "Usa el comando **/bugs** para reportar errores del servidor."
        ],
        comandos: [
          "Puedes usar **ch!soporte** para ver todos los comandos disponibles.",
          "Los comandos del servidor están en **ch!soporte**.",
          "Si necesitas ayuda usa **ch!soporte**."
        ],
        default: [
          "🤖 No entendí completamente tu mensaje, pero puedo ayudarte. Usa **ch!soporte** o sé más específico.",
          "Puedo ayudarte con dudas del servidor, intenta explicarlo mejor 😊",
          "No tengo esa información exacta, pero dime más detalles y te ayudo."
        ]
      };

      const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

      let response;

      if (msg.includes("hola") || msg.includes("buenas") || msg.includes("hello")) {
        response = random(respuestas.saludo);
      } else if (msg.includes("entrar") || msg.includes("como entro")) {
        response = random(respuestas.entrar);
      } else if (msg.includes("staff")) {
        response = random(respuestas.staff);
      } else if (msg.includes("bug") || msg.includes("error")) {
        response = random(respuestas.bugs);
      } else if (msg.includes("comando") || msg.includes("ayuda")) {
        response = random(respuestas.comandos);
      } else {
        response = random(respuestas.default);
      }

      return message.reply(response);
    }
  }
};