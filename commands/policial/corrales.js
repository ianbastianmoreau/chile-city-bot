const { EmbedBuilder } = require("discord.js");
const Corral = require("../../models/Corral");

module.exports = {
  name: "corrales",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "corrales")) {
      return message.reply("❌ No permisos.");
    }

    if (args.length < 7) return message.reply("❌ Uso incorrecto.");

    const [patente, vehiculo, oficial, institucion, nombre, rut, motivo] = args;

    const corral = new Corral({
      userId: message.author.id,
      nombre,
      rut,
      patente,
      vehiculo,
      oficial,
      institucion,
      motivo,
      multa: "Pendiente",
      fecha: new Date().toLocaleString()
    });

    await corral.save();

    const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle("🚗 VEHÍCULO INCAUTADO")
      .setDescription(`
🔢 Patente: ${patente}
🚘 Vehículo: ${vehiculo}

👮 Oficial: ${oficial}
🏛 Institución: ${institucion}

👤 Propietario: ${nombre}
🆔 ${rut}

📌 Motivo: ${motivo}

📅 ${corral.fecha}
      `);

    message.reply({ embeds: [embed] });
  }
};