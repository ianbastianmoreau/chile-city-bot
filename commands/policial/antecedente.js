const { EmbedBuilder } = require("discord.js");
const Antecedente = require("../../models/Antecedente");

module.exports = {
  name: "antecedente",

  async execute(message, args) {

    if (args.length < 10) {
      return message.reply("❌ Uso incompleto.");
    }

    const [
      nombre,
      rut,
      delitos,
      placa,
      rango,
      dispositivo,
      comisaria,
      tipo,
      lugar,
      fiscal
    ] = args;

    const antecedente = new Antecedente({
      userId: message.author.id,
      nombre,
      rut,
      delitos,
      foto: `https://robohash.org/${nombre}.png`,
      placa,
      rango,
      dispositivo,
      comisaria,
      tipo,
      lugar,
      fecha: new Date().toLocaleString(),
      fiscal
    });

    await antecedente.save();

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚔 ANTECEDENTE REGISTRADO")
      .setImage(antecedente.foto)
      .setDescription(`
👤 ${nombre}
🆔 ${rut}

⚖️ Delitos: ${delitos}

👮 ${rango} | Placa: ${placa}
📱 ${dispositivo}
🏛 ${comisaria}
📌 Tipo: ${tipo}

📍 ${lugar}
📅 ${antecedente.fecha}
⚖️ Fiscal: ${fiscal}
      `);

    message.reply({ embeds: [embed] });
  }
};