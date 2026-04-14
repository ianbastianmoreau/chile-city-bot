const { EmbedBuilder } = require("discord.js");
const Corral = require("../../models/Corral");

module.exports = {
  name: "liberar-corrales",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "corrales"))
      return message.reply("❌ No tienes permisos.");

    if (args.length < 1)
      return message.reply("❌ Uso: ch!liberar-corrales patente");

    const patente = args[0];

    const data = await Corral.findOne({ patente });
    if (!data) return message.reply("❌ Vehículo no está en corrales.");

    await Corral.deleteOne({ patente });

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ VEHÍCULO LIBERADO")
      .setDescription(`
🚗 Vehículo: ${data.vehiculo}
🔖 Patente: ${data.patente}

👤 Propietario: ${data.nombre}

👮 Liberado por: ${message.author.tag}
📅 Fecha: ${new Date().toLocaleString("es-CL")}
      `);

    message.reply({ embeds: [embed] });

    client.log(message.guild, `✅ Vehículo liberado: ${patente}`);
  }
};