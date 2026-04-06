const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "encuesta",
  async execute(message, args, client) {

    if (!client.tienePermiso(message.member, "encuesta", client)) {
      return message.reply("❌ No tienes permisos.");
    }

    const minimo = parseInt(args[0]);
    if (!minimo) return message.reply("❌ Debes poner votos mínimos.");

    const embed = new EmbedBuilder()
      .setColor("#ffaa00")
      .setTitle("📊 ENCUESTA DE APERTURA")
      .setDescription(`
¿Abrimos servidor?

🟢 = Sí  
🔴 = No  

🎯 Votos mínimos: ${minimo}
👤 Host: ${message.author}
      `)
      .setImage("https://media.discordapp.net/attachments/1486869005234077746/1490391164296364234/1559708776_2534724415_1775247339066.png?ex=69d3e26f&is=69d290ef&hm=9e0277f985de4874c907e0bba84565c630b97fb9a7762aad2b1819785b5dcf07&=&format=webp&quality=lossless&width=1423&height=800")
      .setTimestamp();

    const msg = await message.channel.send({ content: "@everyone", embeds: [embed] });

    await msg.react("🟢");
    await msg.react("🔴");
  }
};