const { EmbedBuilder } = require("discord.js");
const Vehiculo = require("../../models/Vehiculo");

module.exports = {
  name: "ver-documento",

  async execute(message, args) {

    const slot = parseInt(args[0]);
    const user = message.mentions.users.first() || message.author;

    if (![1,2,3].includes(slot)) {
      return message.reply("❌ Slot inválido (1-3).");
    }

    const data = await Vehiculo.findOne({ userId: user.id, slot });
    if (!data) return message.reply("❌ No hay vehículo en ese registro.");

    const Corral = require("../../models/Corral");

const incautado = await Corral.findOne({ patente: data.patente, activo: true });

if (incautado) {
  embed.addFields({
    name: "🚨 ESTADO",
    value: `Incautado por ${incautado.institucion}`
  });
}

    const embed = new EmbedBuilder()
      .setColor("#0f172a")
      .setTitle("📄 REGISTRO VEHICULAR OFICIAL")
      .setThumbnail("attachment://logo.png")
      .setImage(`https://robohash.org/${data.roblox}.png`)
      .addFields(
        { name: "👤 PROPIETARIO", value: `${data.nombre}`, inline: true },
        { name: "🆔 RUT", value: `${data.rut}`, inline: true },
        { name: "🎮 ROBLOX", value: `${data.roblox}`, inline: true },

        { name: "🚘 VEHÍCULO", value: `${data.marca} ${data.modelo}`, inline: true },
        { name: "📅 AÑO", value: `${data.año}`, inline: true },
        { name: "🔢 PATENTE", value: `${data.patente}`, inline: true },

        { name: "📁 REGISTRO", value: `#${slot}`, inline: true }
      )
      .setFooter({ text: "Chile City RP | Documento Oficial" })
      .setTimestamp();

    message.reply({
      embeds: [embed],
      files: ["./assets/logo.png"]
    });
  }
};