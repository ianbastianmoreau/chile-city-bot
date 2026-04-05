const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bugs')
    .setDescription('Reportar bug')
    .addStringOption(opt =>
      opt.setName('tipo')
        .setDescription('Tipo de bug')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('situacion')
        .setDescription('Describe el bug')
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName('pruebas')
        .setDescription('Imagen del bug')
        .setRequired(true)
    ),

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