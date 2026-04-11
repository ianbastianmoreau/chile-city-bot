const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "encuesta",
  async execute(message, args, client) {

    if (!client.tienePermiso(message.member, "encuesta", client)) {
      return message.reply("❌ No tienes permisos.");
    }

    // 📌 validar votos mínimos
    const minimo = parseInt(args[0]);
    if (!minimo || minimo <= 0) {
      return message.reply("❌ Debes indicar un número válido de votos mínimos.");
    }

    // 📌 validar encargado
    const encargado = message.mentions.users.first();
    if (!encargado) {
      return message.reply("❌ Debes mencionar al encargado de moderación.");
    }

    //⏰hora
    const hora = args[1];
if (!hora) return message.reply("❌ Debes indicar hora (ej: 20:00)");

    const embed = new EmbedBuilder()
      .setColor("#ffaa00")
      .setTitle("📊 ENCUESTA DE APERTURA")
      .setDescription(`
Se está evaluando una posible apertura del servidor.

🟢 = Me uno  
🔴 = No me uno  

🎯 Votos mínimos requeridos: **${minimo}**
👮 Encargado de moderación: ${encargado}
⏰ Apertura programada: ${hora}

📌 Tu voto influye en futuras aperturas del servidor.
      `)
      .setImage("https://media.discordapp.net/attachments/1486869005234077746/1490391164296364234/1559708776_2534724415_1775247339066.png?ex=69d3e26f&is=69d290ef&hm=9e0277f985de4874c907e0bba84565c630b97fb9a7762aad2b1819785b5dcf07&=&format=webp&quality=lossless&width=1423&height=800")
      .setFooter({ text: "Chile City Roleplay" })
      .setTimestamp();

    const msg = await message.channel.send({
      content: "@everyone",
      embeds: [embed]
    });

    await msg.react("🟢");
    await msg.react("🔴");
  }
};