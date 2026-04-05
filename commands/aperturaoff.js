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
⏳ Próxima apertura pronto  

👤 Host: ${message.author}
      `)
      .setImage("https://media.discordapp.net/attachments/1486869005234077746/1490391899792605404/1559708776_2534724415_1775145037530.png?ex=69d3e31f&is=69d2919f&hm=e95caa7772bae6b5cc264e57b396b3ed1b1740775b497173c0504244dd5df61d&=&format=webp&quality=lossless&width=1523&height=800") // 🔥 CAMBIA
      .setFooter({ text: "Chile City Roleplay" })
      .setTimestamp();

    message.channel.send({
      content: "@everyone",
      embeds: [embed]
    });
  }
};