const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "aperturaoff",
  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("🔴 SERVIDOR CERRADO")
      .setDescription(`
El servidor se encuentra cerrado.

🚫 No intentes unirte  
⏳ Habrá apertura pronto  

👤 Host: ${message.author}
      `)
      .setImage("https://i.imgur.com/yourimage2.png");

    message.channel.send({ content: "@everyone", embeds: [embed] });
  }
};