const Vehiculo = require("../models/Vehiculo");
const DNI = require("../models/DNI");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "registrar-vehiculo",

  async execute(message, args) {

    const [slot, marca, modelo, patente, año] = args;

    if (!slot || slot > 3)
      return message.reply("❌ Slot inválido (1-3)");

    const dni = await DNI.findOne({ userId: message.author.id });
    if (!dni) return message.reply("❌ No tienes DNI.");

    const existe = await Vehiculo.findOne({
      userId: message.author.id,
      slot
    });

    if (existe) return message.reply("❌ Ya tienes vehículo en ese slot.");

    const vehiculo = new Vehiculo({
      userId: message.author.id,
      slot,
      marca,
      modelo,
      patente,
      año
    });

    await vehiculo.save();

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`🚗 VEHÍCULO REGISTRO ${slot}`)
      .setDescription(`
👤 ${dni.nombres} ${dni.apellidos}
🆔 ${dni.rut}

🚘 ${marca} ${modelo}
📌 ${patente}
📅 ${año}
      `)
      .setImage(dni.robloxAvatar);

    message.reply({ embeds: [embed] });
  }
};