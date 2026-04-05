const { EmbedBuilder } = require('discord.js');

const STAFF_ROLE_ID = "1436890733847253062";

module.exports = {
  name: "encuesta",
  async execute(message, args) {

    const minimo = args[0];

    if (!minimo || isNaN(minimo)) {
      return message.reply("❌ Debes indicar el mínimo de votos. Ej: ch!encuesta 10");
    }

    const embed = new EmbedBuilder()
      .setColor("#ffaa00")
      .setTitle("📊 ENCUESTA APERTURA")
      .setDescription(`
¿Deseas que abramos el servidor?

🟢 = Me uno  
🔴 = No me uno  

🎯 **Mínimo de votos:** ${minimo}

📌 Una vez alcanzado el mínimo, se procederá a la apertura del servidor.
🔥 Recordar unirse a una escena al momento de proceder con la apertura del servidor.

👤 Host: ${message.author}
      `)
      .setImage("https://media.discordapp.net/attachments/1486869005234077746/1490391164296364234/1559708776_2534724415_1775247339066.png")
      .setFooter({ text: "Chile City Roleplay • Sistema de Encuestas" })
      .setTimestamp();

    const msg = await message.channel.send({
      content: "@everyone",
      embeds: [embed]
    });

    await msg.react("🟢");
    await msg.react("🔴");
  }
};