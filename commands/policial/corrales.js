const { EmbedBuilder } = require("discord.js");
const Corral = require("../../models/Corral");

module.exports = {
  name: "corrales",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "corrales"))
      return message.reply("❌ No tienes permisos.");

    if (args.length < 7)
      return message.reply("❌ Uso: ch!corrales nombre rut patente vehiculo institucion motivo multa");

    const [nombre, rut, patente, vehiculo, institucion, motivo, multa] = args;

    const fecha = new Date().toLocaleString("es-CL");

    const data = new Corral({
      userId: message.author.id,
      nombre,
      rut,
      patente,
      vehiculo,
      oficial: message.author.tag,
      institucion,
      motivo,
      multa,
      fecha
    });

    await data.save();

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🚨 VEHÍCULO INCAUTADO")
      .setDescription(`
🚗 Vehículo: ${vehiculo}
🔖 Patente: ${patente}

👤 Propietario: ${nombre}
🆔 RUT: ${rut}

👮 Oficial: ${message.author.tag}
🏛 Institución: ${institucion}

⚠️ Motivo: ${motivo}
💰 Multa: $${multa}

📅 Fecha: ${fecha}

🚫 Estado: **INCAUTADO**
      `)
      .setFooter({ text: "Registro de Corrales | Chile City RP" });

    message.reply({ embeds: [embed] });

    client.log(message.guild, `🚨 Vehículo incautado: ${patente}`);
  }
};