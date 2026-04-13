const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "informacion",

  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("📘 Información Chile City RP")
      .setDescription("Usa ch!soporte para ver información del servidor.");

    message.reply({ embeds: [embed] });
  }
};