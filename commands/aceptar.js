module.exports = {
  name: "aceptar",
  async execute(message, args) {

    const user = message.mentions.users.first();
    const trabajo = args.slice(1).join(" ");

    if (!user || !trabajo) {
      return message.reply("❌ Uso: ch!aceptar @usuario trabajo");
    }

    const trabajosValidos = [
      "mcdonalds",
      "starbucks",
      "copec",
      "cartero",
      "locomocion colectiva",
      "recolector de basura",
      "derecho"
    ];

    if (!trabajosValidos.includes(trabajo.toLowerCase())) {
      return message.reply("❌ Trabajo no válido.");
    }

    message.channel.send(`✅ ${user} ha sido aceptado como **${trabajo}**.`);
  }
};