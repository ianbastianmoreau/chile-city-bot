const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('solicitarrol')
    .setDescription('Solicitar rol')
    .addStringOption(opt =>
      opt.setName('rol')
        .setDescription('Rol que deseas solicitar')
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName('pruebas')
        .setDescription('Pruebas de la solicitud')
        .setRequired(true)
    ),

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