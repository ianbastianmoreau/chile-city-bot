const { EmbedBuilder } = require("discord.js");
const Multa = require("../../models/Multa");

module.exports = {
  name: "multa",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "multas"))
      return message.reply("❌ No tienes permisos.");

    if (args.length < 8)
      return message.reply("❌ Uso: ch!multa nombre rut articulos placa rango dispositivo comisaria lugar");

    const [nombre, rut, articulos, placa, rango, dispositivo, comisaria, lugar] = args;

    const fecha = new Date().toLocaleString("es-CL");

    const data = new Multa({
      userId: message.author.id,
      nombre,
      rut,
      articulos,
      placa,
      rango,
      dispositivo,
      comisaria,
      lugar,
      fecha,
      vehiculo: "No especificado"
    });

    await data.save();

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("💸 MULTA REGISTRADA")
      .setDescription(`
👤 Nombre: ${nombre}
🆔 RUT: ${rut}

⚖️ Artículos: ${articulos}

👮 Placa: ${placa}
🎖 Rango: ${rango}
📱 Dispositivo: ${dispositivo}
🏛 Comisaría: ${comisaria}

📍 Lugar: ${lugar}
📅 Fecha: ${fecha}
      `);

    message.reply({ embeds: [embed] });

    client.log(message.guild, `💸 Multa aplicada a ${nombre}`);
  }
};