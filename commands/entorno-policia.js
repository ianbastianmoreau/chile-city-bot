const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "entorno-policial",

  async execute(message, args) {

    if (args.length < 3) {
      return message.reply("❌ Uso: ch!entorno-policial info autos armas institucion");
    }

    const [info, autos, armas, ...instArr] = args;
    const institucion = instArr.join(" ");

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚔 REPORTE POLICIAL")
      .setDescription(`
📌 Información: ${info}

🚗 Vehículos: ${autos}
🔫 Armas: ${armas}

🏛 Institución: ${institucion}

👮 Reportado por: ${message.author}
      `)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
};