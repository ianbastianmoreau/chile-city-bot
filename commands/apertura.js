const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "aperturaon",
  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor("#00ff88")
      .setTitle("🟢 SERVIDOR ABIERTO")
      .setDescription(`
**Nombre:** Chile City RolePlay  
**Código:** ChileCity  

📌 Recuerda leer las normas antes de entrar  
👤 Host: ${message.author}

¡Servidor abierto, únete ahora!
      `)
      .setImage("https://i.imgur.com/yourimage.png")
      .setFooter({ text: "Chile City Roleplay" });

    message.channel.send({ content: "@everyone", embeds: [embed] });
  }
};