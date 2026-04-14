const { EmbedBuilder } = require("discord.js");
const Antecedente = require("../../models/Antecedente");

module.exports = {
  name: "antecedente",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "antecedentes")) {
      return message.reply("❌ No tienes permisos.");
    }

    if (args.length < 11) {
      return message.reply("❌ Uso:\nch!antecedente Nombre-Apellido RUT Delitos FotoURL Placa Rango Dispositivo Comisaria Tipo Lugar Fiscal");
    }

    const [
      nombre,
      rut,
      delitos,
      foto,
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
      foto,
      placa,
      rango,
      dispositivo,
      comisaria,
      tipo,
      lugar,
      fiscal,
      fecha: new Date().toLocaleString("es-CL")
    });

    await antecedente.save();

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("📁 REGISTRO POLICIAL")

      .addFields(
        { name: "👤 Datos del Sujeto", value:
`Nombre: ${nombre}
RUT: ${rut}
Delitos: ${delitos}`, inline: false },

        { name: "👮 Datos Policiales", value:
`Placa: ${placa}
Rango: ${rango}
Dispositivo: ${dispositivo}
Comisaría: ${comisaria}
Tipo: ${tipo}`, inline: false },

        { name: "📍 Detención", value:
`Lugar: ${lugar}
Fecha: ${antecedente.fecha}
Fiscal: ${fiscal}`, inline: false }
      )

      .setImage(foto)
      .setFooter({ text: "Sistema Policial | Chile City RP" });

    message.reply({ embeds: [embed] });

    client.log(message.guild, `📁 Antecedente creado para ${nombre}`);
  }
};