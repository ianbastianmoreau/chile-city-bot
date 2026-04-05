const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bugs')
    .setDescription('Reportar bug')
    .addStringOption(opt => opt.setName('tipo').setDescription('Tipo de bug').setRequired(true))
    .addStringOption(opt => opt.setName('situacion').setDescription('Situación').setRequired(true))
    .addStringOption(opt => opt.setName('pruebas').setDescription('Pruebas').setRequired(true)),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor("#ff9900")
      .setTitle("🐞 REPORTE DE BUG")
      .setDescription(`
📂 Tipo: ${interaction.options.getString('tipo')}
📌 Situación: ${interaction.options.getString('situacion')}
📸 Pruebas: ${interaction.options.getString('pruebas')}
👤 Usuario: ${interaction.user}
      `);

    await interaction.reply({ embeds: [embed] });
  }
};