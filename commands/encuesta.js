const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "encuesta",
  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor("#ffaa00")
      .setTitle("📊 ENCUESTA APERTURA")
      .setDescription(`
¿Abrimos servidor?

✅ = Me uno  
❌ = No me uno  

👤 Host: ${message.author}
      `)
      .setImage("https://i.imgur.com/yourimage3.png");

    const msg = await message.channel.send({
      content: "@everyone",
      embeds: [embed]
    });

    await msg.react("✅");
    await msg.react("❌");
  }
};