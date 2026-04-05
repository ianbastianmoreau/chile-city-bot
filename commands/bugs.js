const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bugs')
    .setDescription('Reportar bug')
    .addStringOption(opt => opt.setName('tipo').setRequired(true))
    .addStringOption(opt => opt.setName('situacion').setRequired(true))
    .addAttachmentOption(opt => opt.setName('pruebas').setRequired(true)),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor("#ff9900")
      .setTitle("🐞 REPORTE DE BUG")
      .setDescription(`
📂 Tipo: ${interaction.options.getString('tipo')}
📌 Situación: ${interaction.options.getString('situacion')}
👤 Usuario: ${interaction.user}
      `)
      .setImage(interaction.options.getAttachment('pruebas').url)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};