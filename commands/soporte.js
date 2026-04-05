const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "soporte",
  execute(message) {

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("📌 COMANDOS DISPONIBLES")
      .setDescription(`
👥 Usuarios:

/calificar
/bugs
/solicitarrol

💬 Usa estos comandos para interactuar.

⚠️ Los comandos administrativos son solo para staff.
      `);

    message.channel.send({ embeds: [embed] });
  }
};