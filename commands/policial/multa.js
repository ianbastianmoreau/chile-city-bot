const { EmbedBuilder } = require("discord.js");
const Multa = require("../../models/Multa");

module.exports = {
  name: "multa",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "multas")) {
      return message.reply("❌ No tienes permisos.");
    }

    if (args.length < 9) return message.reply("❌ Uso incorrecto.");

    const [nombre, rut, articulos, placa, rango, dispositivo, comisaria, lugar, incautado] = args;

    const multa = new Multa({
      userId: message.author.id,
      nombre,
      rut,
      articulos,
      foto: `https://robohash.org/${nombre}.png`,
      placa,
      rango,
      dispositivo,
      comisaria,
      lugar,
      fecha: new Date().toLocaleString(),
      vehiculoIncautado: incautado
    });

    await multa.save();

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("📄 MULTA REGISTRADA")
      .setImage(multa.foto)
      .setDescription(`
👤 ${nombre}
🆔 ${rut}

📜 Artículos: ${articulos}

👮 ${rango} | ${placa}
🏛 ${comisaria}

📍 ${lugar}
🚗 Incautado: ${incautado}
      `);

    message.reply({ embeds: [embed] });
  }
};