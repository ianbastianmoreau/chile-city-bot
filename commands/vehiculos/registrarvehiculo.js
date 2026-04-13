const { EmbedBuilder } = require("discord.js");
const Vehiculo = require("../../models/Vehiculo");

module.exports = {
  name: "registrarvehiculo",

  async execute(message, args) {

    if (args.length < 7) {
      return message.reply("❌ Uso: ch!registrarvehiculo slot usuario nombre rut roblox marca modelo patente año");
    }

    const slot = parseInt(args[0]);
    const user = message.mentions.users.first();

    if (!user) return message.reply("❌ Debes mencionar un usuario.");
    if (![1,2,3].includes(slot)) return message.reply("❌ Slot debe ser 1, 2 o 3.");

    const [_, __, nombre, rut, roblox, marca, modelo, patente, año] = args;

    const existe = await Vehiculo.findOne({ userId: user.id, slot });
    if (existe) return message.reply("❌ Ese slot ya está ocupado.");

    const vehiculo = new Vehiculo({
      userId: user.id,
      slot,
      nombre,
      rut,
      roblox,
      marca,
      modelo,
      patente,
      año,
      creadoPor: message.author.id
    });

    await vehiculo.save();

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`🚗 REGISTRO VEHICULAR #${slot}`)
      .setDescription(`
👤 ${nombre}
🆔 ${rut}
🎮 ${roblox}

🚘 ${marca} ${modelo}
📅 Año: ${año}
🔢 Patente: ${patente}

👮 Registrado por: ${message.author}
      `)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};