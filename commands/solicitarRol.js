const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('solicitarrol')
    .setDescription('Solicitar rol')
    .addStringOption(opt => opt.setName('rol').setRequired(true))
    .addAttachmentOption(opt => opt.setName('pruebas').setRequired(true)),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor("#00bfff")
      .setTitle("📩 SOLICITUD DE ROL")
      .setDescription(`
👤 Usuario: ${interaction.user}
🎭 Rol solicitado: ${interaction.options.getString('rol')}
      `)
      .setImage(interaction.options.getAttachment('pruebas').url)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};