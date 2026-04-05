const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "aperturaon",
  async execute(message, args) {

    const nota = args.join(" ");

    if (!nota) {
      return message.reply("❌ Debes añadir una nota. Ej: ch!aperturaon Servidor estable");
    }

    const embed = new EmbedBuilder()
      .setColor("#00ff88")
      .setTitle("🟢 SERVIDOR ABIERTO")
      .setDescription(`
**Nombre:** Chile City RolePlay  
**Código:** ChileCity  

📌 Recuerda leer las normas antes de ingresar al servidor.
⚠️ Evita sanciones cumpliendo correctamente el rol.

📝 **Nota:** ${nota}

👤 Host: ${message.author}
      `)
      .setImage("https://media.discordapp.net/attachments/1486869005234077746/1490391566433390764/1559708776_2534724415_1775247153820.png")
      .setFooter({ text: "Chile City Roleplay • Apertura Oficial" })
      .setTimestamp();

    message.channel.send({
      content: "@everyone",
      embeds: [embed]
    });
  }
};