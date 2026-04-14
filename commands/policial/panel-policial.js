const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const Antecedente = require("../../models/Antecedente");
const Multa = require("../../models/Multa");
const Corral = require("../../models/Corral");

module.exports = {
  name: "panel-policial",

  async execute(message, args, client) {

    if (!client.tienePermisoPolicial(message.member, "antecedentes"))
      return message.reply("❌ No tienes permisos.");

    if (!args[0])
      return message.reply("❌ Uso: ch!panel-policial RUT");

    const rut = args[0];

    const embed = new EmbedBuilder()
      .setColor("DarkBlue")
      .setTitle("🚔 SISTEMA MDT POLICIAL")
      .setDescription(`
🔍 Consulta de información policial

🆔 RUT: **${rut}**

Selecciona una opción abajo para ver datos del sujeto.
      `)
      .setFooter({ text: "Chile City RP | Sistema Policial" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`antecedentes_${rut}`)
        .setLabel("Antecedentes")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(`multas_${rut}`)
        .setLabel("Multas")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId(`corrales_${rut}`)
        .setLabel("Corrales")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId(`info_${rut}`)
        .setLabel("Info Completa")
        .setStyle(ButtonStyle.Success)
    );

    message.reply({ embeds: [embed], components: [row] });
  }
};