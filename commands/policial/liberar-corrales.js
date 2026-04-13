const Corral = require("../../models/Corral");

module.exports = {
  name: "liberar-corrales",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "corrales")) {
      return message.reply("❌ No permisos.");
    }

    const patente = args[0];
    if (!patente) return message.reply("❌ Indica patente.");

    const data = await Corral.findOne({ patente, activo: true });
    if (!data) return message.reply("❌ No está en corrales.");

    data.activo = false;
    await data.save();

    message.reply(`✅ Vehículo ${patente} liberado.`);
  }
};