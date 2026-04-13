const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "aperturaon",
  async execute(message, args, client) {

    if (!client.tienePermiso(message.member, "aperturaon", client)) {
      return message.reply("❌ No tienes permisos.");
    }

    const nota = args.join(" ") || "Sin nota adicional.";

    const embed = new EmbedBuilder()
      .setColor("#00ff88")
      .setTitle("🟢 SERVIDOR ABIERTO")
      .setDescription(`
El servidor ha sido abierto oficialmente.

🔑 Código: ChileCity  
📌 Nota: ${nota}

📖 Recuerda seguir las normas para evitar sanciones.
👤 Host: ${message.author}
      `)
      .setImage("https://media.discordapp.net/attachments/1486869005234077746/1490391566433390764/1559708776_2534724415_1775247153820.png?ex=69d3e2cf&is=69d2914f&hm=3203b269dc6dcd3af7b8151d0e42341cd53be80d9179f978e9ca38b659547996&=&format=webp&quality=lossless&width=1423&height=800")
      .setTimestamp();

    message.channel.send({ content: "@everyone", embeds: [embed] });
  }
};