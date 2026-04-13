const Vehiculo = require("../../models/Vehiculo");

module.exports = {
  name: "eliminar-documento",

  async execute(message, args) {

    const slot = parseInt(args[0]);
    const user = message.mentions.users.first();

    if (!user) return message.reply("❌ Menciona usuario.");
    if (![1,2,3].includes(slot)) return message.reply("❌ Slot inválido.");

    const data = await Vehiculo.findOneAndDelete({ userId: user.id, slot });

    if (!data) return message.reply("❌ No existe vehículo en ese slot.");

    message.reply(`✅ Vehículo #${slot} eliminado.`);
  }
};