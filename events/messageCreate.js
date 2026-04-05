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
      } catch (err) {
        console.error(err);
        message.reply("❌ Error ejecutando el comando.");
      }
    }

    // =====================
    // 🧠 IA PRO+
    // =====================
    if (!message.mentions.has(client.user)) return;

    const userId = message.author.id;
    const raw = message.content;
    const msg = raw.toLowerCase();

    // ===== MEMORIA =====
    if (!memory.has(userId)) memory.set(userId, []);
    const userMemory = memory.get(userId);

    userMemory.push(msg);
    if (userMemory.length > 8) userMemory.shift();

    const contexto = userMemory.join(" | ");

    // ===== UTIL =====
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // ===== DETECCIÓN DE INTENCIÓN =====
    let intent = "default";

    if (/hola|buenas|hello/.test(msg)) intent = "saludo";
    else if (/entrar|ip|codigo|cómo entro|como entro/.test(msg)) intent = "entrar";
    else if (/staff|admin|moderador/.test(msg)) intent = "staff";
    else if (/bug|error|falla/.test(msg)) intent = "bug";
    else if (/comando|ayuda|help/.test(msg)) intent = "comandos";
    else if (/gracias/.test(msg)) intent = "agradecimiento";
    else if (/quien eres|qué eres/.test(msg)) intent = "identidad";

    // ===== GENERADOR DE RESPUESTAS =====
    let respuesta = "";

    switch (intent) {

      case "saludo":
        respuesta = rand([
          `👋 Hola ${message.author}, bienvenido a **Chile City Roleplay**.\nEstoy aquí para ayudarte con cualquier duda del servidor, comandos o ingreso.\n\n¿En qué necesitas ayuda exactamente?`,
          `Buenas ${message.author} 😎\nSoy el asistente del servidor. Puedo orientarte sobre ingreso, staff, bugs o comandos.\n\nDime qué necesitas.`,
          `Hola ${message.author} 👀\nSi tienes dudas del servidor, puedo ayudarte paso a paso.\n\nSolo dime qué quieres hacer.`
        ]);
      break;

      case "entrar":
        respuesta = rand([
          `Para ingresar al servidor debes esperar una **apertura activa**.\n\n📌 Código: **ChileCity**\n📌 Recomendación: revisa siempre los anuncios para saber cuándo abrirá.\n\nSi quieres, te explico cómo funciona el acceso paso a paso.`,
          `El ingreso funciona mediante aperturas.\n\nCuando el servidor esté abierto:\n➡ usas el código **ChileCity**\n➡ entras normalmente\n\nSi no puedes entrar, dime y te ayudo.`,
          `Actualmente el acceso depende de aperturas del servidor.\n\n🔑 Código: **ChileCity**\n📢 Mantente atento a anuncios.\n\n¿Estás teniendo problemas para entrar?`
        ]);
      break;

      case "staff":
        respuesta = rand([
          `El equipo de staff se gestiona mediante postulaciones.\n\n✔ Puedes calificar staff con **/calificar**\n✔ Postular cuando haya cupos\n\nSi necesitas ayuda con eso, dime.`,
          `Si quieres ser staff:\n📌 Debes esperar postulaciones abiertas\n📌 Cumplir requisitos del servidor\n\nTambién puedes evaluar staff con **/calificar**.`,
          `El sistema de staff incluye:\n- postulaciones\n- evaluaciones\n\nPuedes usar **/calificar** si tuviste una experiencia.`
        ]);
      break;

      case "bug":
        respuesta = rand([
          `Para reportar un error usa:\n➡ **/bugs**\n\n📌 Incluye:\n- descripción clara\n- imagen\n\nEso ayuda a que se solucione más rápido.`,
          `Los bugs deben reportarse con pruebas.\n\nUsa **/bugs** y adjunta imagen.\n\nMientras más detalles des, mejor.`,
          `Si encontraste un bug:\n📌 usa **/bugs**\n📌 explica bien la situación\n📌 adjunta pruebas\n\nAsí el staff puede revisarlo.`
        ]);
      break;

      case "comandos":
        respuesta = rand([
          `Puedes ver comandos con **ch!soporte**.\n\nAhí encontrarás:\n- comandos básicos\n- sistema del servidor\n\nSi buscas algo específico dime.`,
          `El listado de comandos está en **ch!soporte**.\n\nSi necesitas uno en particular, dime qué quieres hacer.`,
          `Usa **ch!soporte** para ver todo.\n\nTambién puedo explicarte cualquier comando.`
        ]);
      break;

      case "agradecimiento":
        respuesta = rand([
          `😎 Para eso estoy.\nSi necesitas algo más, dime.`,
          `Un gusto ayudarte.\nAquí estaré si necesitas algo.`,
          `De nada 👀\nSigo disponible para lo que necesites.`
        ]);
      break;

      case "identidad":
        respuesta = rand([
          `Soy el asistente oficial de **Chile City Roleplay** 🤖\n\nEstoy diseñado para ayudarte con:\n- ingreso\n- comandos\n- soporte\n\nY resolver dudas del servidor.`,
          `Soy el bot de soporte del servidor.\n\nMi función es ayudarte y guiarte en todo lo relacionado al RP.`,
          `Soy una IA integrada al servidor para asistencia.\n\nPuedo ayudarte con prácticamente todo lo del servidor.`
        ]);
      break;

      default:

        // 🔥 CONTEXTO AVANZADO
        if (contexto.includes("entrar")) {
          respuesta = "Parece que sigues con dudas sobre cómo entrar.\nRecuerda: debes esperar apertura y usar el código **ChileCity**.";
        }
        else if (contexto.includes("bug")) {
          respuesta = "Si sigues con el bug, usa **/bugs** con imagen.\nEso permitirá al staff revisarlo correctamente.";
        }
        else if (contexto.includes("staff")) {
          respuesta = "Si tu duda es sobre staff, puedes postular cuando abran o usar **/calificar**.";
        }
        else {
          respuesta = rand([
            `🤖 No entendí completamente lo que necesitas.\n\nPero puedo ayudarte con:\n- ingreso al servidor\n- comandos\n- bugs\n- staff\n\nExplícame un poco mejor.`,
            `No tengo claro lo que buscas.\n\nSi me das más detalles puedo ayudarte mejor.`,
            `Estoy aquí para ayudarte.\n\nIntenta explicarlo de otra forma o sé más específico.`
          ]);
        }
    }

    // ===== CONTROL LONGITUD =====
    if (respuesta.length > 900) {
      respuesta = respuesta.slice(0, 900);
    }

    return message.reply(respuesta);
  }
};