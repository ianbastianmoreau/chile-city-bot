const { EmbedBuilder } = require("discord.js");
const Antecedente = require("../../models/Antecedente");

module.exports = {
  name: "antecedente",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "antecedentes"))
      return message.reply("❌ No tienes permisos.");

    if (args.length < 12)
      return message.reply("❌ Uso: ch!antecedente nombre rut delitos foto placa rango dispositivo comisaria tipo lugar fecha fiscal");

    const [
      nombre, rut, delitos, foto,
      placa, rango, dispositivo, comisaria, tipo,
      lugar, fecha, fiscal
    ] = args;

    const nuevo = new Antecedente({
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
      fecha,
      fiscal
    });

    await nuevo.save();

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚔 REGISTRO DE ANTECEDENTE")
      .setDescription(`
**Datos Sujeto**
> Nombre: ${nombre}
> RUT: ${rut}
> Delitos: ${delitos}

**Datos Policial**
> Placa: ${placa}
> Rango: ${rango}
> Dispositivo: ${dispositivo}
> Comisaría: ${comisaria}
> Tipo: ${tipo}

**Datos Detención**
> Lugar: ${lugar}
> Fecha: ${fecha}
> Fiscal: ${fiscal}
      `)
      .setImage(foto)
      .setFooter({ text: "Sistema Policial Chile City RP" });

    message.reply({ embeds: [embed] });
  }
};