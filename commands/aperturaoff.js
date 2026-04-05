const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "aperturaoff",
  async execute(message, args) {

    const motivo = args[0];
    const nota = args.slice(1).join(" ");

    if (!motivo || !nota) {
      return message.reply("❌ Uso correcto: ch!aperturaoff <motivo> <nota>");
    }

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("🔴 SERVIDOR CERRADO")
      .setDescription(`
El servidor se encuentra actualmente cerrado.

🚫 No intentes ingresar mientras esté cerrado.
⏳ Se anunciará una nueva apertura próximamente.

📌 **Motivo:** ${motivo}
📝 **Nota:** ${nota}

👤 Host: ${message.author}
      `)
      .setImage("https://media.discordapp.net/attachments/1486869005234077746/1490391899792605404/1559708776_2534724415_1775145037530.png")
      .setFooter({ text: "Chile City Roleplay • Estado del Servidor" })
      .setTimestamp();

    message.channel.send({
      content: "@everyone",
      embeds: [embed]
    });
  }
};