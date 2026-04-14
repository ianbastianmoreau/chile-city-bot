const { EmbedBuilder } = require("discord.js");
const Multa = require("../../models/Multa");

module.exports = {
  name: "multa",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "multas")) {
      return message.reply("❌ No tienes permisos.");
    }

    if (args.length < 10) {
      return message.reply("❌ Uso:\nch!multa Nombre-Apellido RUT Articulos FotoURL Placa Rango Dispositivo Comisaria Lugar Vehiculo(SI/NO)");
    }

    const [
      nombre,
      rut,
      articulos,
      foto,
      placa,
      rango,
      dispositivo,
      comisaria,
      lugar,
      vehiculo
    ] = args;

    const multa = new Multa({
      userId: message.author.id,
      nombre,
      rut,
      articulos,
      foto,
      placa,
      rango,
      dispositivo,
      comisaria,
      lugar,
      vehiculo,
      fecha: new Date().toLocaleString("es-CL")
    });

    await multa.save();

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("💸 MULTA REGISTRADA")

      .addFields(
        { name: "👤 Datos del Sujeto", value:
`Nombre: ${nombre}
RUT: ${rut}
Artículos: ${articulos}`, inline: false },

        { name: "👮 Datos Policiales", value:
`Placa: ${placa}
Rango: ${rango}
Dispositivo: ${dispositivo}
Comisaría: ${comisaria}`, inline: false },

        { name: "📍 Datos Multa", value:
`Lugar: ${lugar}
Fecha: ${multa.fecha}
Vehículo Incautado: ${vehiculo}`, inline: false }
      )

      .setImage(foto)
      .setFooter({ text: "Sistema Multas | Chile City RP" });

    message.reply({ embeds: [embed] });

    client.log(message.guild, `💸 Multa registrada para ${nombre}`);
  }
};