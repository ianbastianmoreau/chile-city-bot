const memory = new Map();
const prefix = "ch!";

module.exports = {
  name: "messageCreate",
  async execute(message, client) {

    if (message.author.bot) return;

    // =====================
    // 📌 PREFIX COMMANDS
    // =====================
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const cmd = args.shift()?.toLowerCase();

      const command = client.prefixCommands.get(cmd);
      if (!command) return;

      try {
        await command.execute(message, args, client);
      } catch (err) {
        console.error(err);
        return message.reply("❌ Error ejecutando comando.");
      }

      return; // 🔥 IMPORTANTE: evita que siga a IA
    }

    // =====================
    // 🧠 IA PRO+
    // =====================
    if (!message.mentions.has(client.user)) return;

    const userId = message.author.id;
    const msg = message.content.toLowerCase();

    // ===== MEMORIA =====
    if (!memory.has(userId)) memory.set(userId, []);
    const userMemory = memory.get(userId);

    userMemory.push(msg);
    if (userMemory.length > 8) userMemory.shift();

    const contexto = userMemory.join(" | ");

    // ===== UTIL =====
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // ===== INTENT =====
    let intent = "default";

    if (/hola|buenas|hello/.test(msg)) intent = "saludo";
    else if (/entrar|ip|codigo|como entro/.test(msg)) intent = "entrar";
    else if (/staff|admin/.test(msg)) intent = "staff";
    else if (/bug|error/.test(msg)) intent = "bug";
    else if (/comando|ayuda/.test(msg)) intent = "comandos";
    else if (/gracias/.test(msg)) intent = "agradecimiento";
    else if (/quien eres/.test(msg)) intent = "identidad";

    let respuesta = "";

    switch (intent) {

      case "saludo":
        respuesta = `👋 Hola ${message.author}\nSoy el asistente de **Chile City RP**.\n¿En qué necesitas ayuda?`;
      break;

      case "entrar":
        respuesta = `🔑 Para entrar usa el código **ChileCity** cuando el servidor esté abierto.\nRevisa anuncios.`;
      break;

      case "staff":
        respuesta = `👮 Puedes postular cuando abran cupos o usar /calificar para evaluar staff.`;
      break;

      case "bug":
        respuesta = `🐞 Usa /bugs con imagen y explicación para reportar errores.`;
      break;

      case "comandos":
        respuesta = `📜 Usa **ch!soporte** para ver todos los comandos.`;
      break;

      case "agradecimiento":
        respuesta = `😎 De nada, aquí estoy.`;
      break;

      case "identidad":
        respuesta = `🤖 Soy el bot oficial de Chile City RP.`;
      break;

      default:
        if (contexto.includes("entrar")) {
          respuesta = "Recuerda: necesitas apertura y usar **ChileCity**.";
        } else {
          respuesta = "🤖 No entendí bien, intenta explicarlo mejor.";
        }
    }

    if (respuesta.length > 900) {
      respuesta = respuesta.slice(0, 900);
    }

    return message.reply(respuesta);
  }
};