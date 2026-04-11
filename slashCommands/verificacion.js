const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');

const CANAL_VERIFICACION = "1489437484356993105"; // 👈 CAMBIA ESTO
const ROL_VERIFICADO = "1451096471922413639"; // 👈 OPCIONAL

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verificacion')
    .setDescription('Sistema de verificación'),

  async execute(interaction) {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verificar_btn')
        .setLabel('Verificarse')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: "📩 Presiona el botón para iniciar verificación",
      components: [row]
    });
  }
};