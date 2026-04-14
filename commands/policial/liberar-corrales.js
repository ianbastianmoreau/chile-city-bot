const Corral = require("../../models/Corral");

module.exports = {
  name: "liberar-corrales",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "corrales"))
      return message.reply("❌ No permisos.");

    const patente = args[0]?.toUpperCase();
    if (!patente) return;

    const existe = await Corral.findOne({ patente });
    if (!existe) return message.reply("❌ No está incautado.");

    await Corral.deleteOne({ patente });

    message.reply("✅ Vehículo liberado.");
  }
};