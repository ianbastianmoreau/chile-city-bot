const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "rechazar",
  async execute(message, args) {

    const user = message.mentions.users.first();
    const trabajo = args.slice(1).join(" ");

    if (!user || !trabajo) {
      return message.reply("❌ Uso: ch!rechazar @usuario trabajo");
    }

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("❌ POSTULACIÓN RECHAZADA")
      .setDescription(`
👤 Usuario: ${user}
💼 Trabajo: ${trabajo}

📌 Puedes volver a postular en futuras convocatorias.
      `)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
};