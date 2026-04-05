const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "ch!";

  // COMANDOS
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) command.execute(message, args);
    return;
  }

  // IA SOLO SI MENCIONAN AL BOT
  if (message.mentions.has(client.user)) {
    try {
      const respuesta = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Eres el asistente oficial de un servidor de Discord llamado Chile City Roleplay.
Debes ayudar a los usuarios con dudas sobre:
- cómo entrar al servidor
- reglas
- comandos
- rol
- staff

Responde SIEMPRE en español, claro, amigable y directo.
No hables como IA, habla como staff del servidor.
            `
          },
          {
            role: "user",
            content: message.content
          }
        ]
      });

      const reply = respuesta.choices[0].message.content;
      message.reply(reply);

    } catch (error) {
      console.error(error);
      message.reply("⚠️ Hubo un error con la IA.");
    }
  }
});