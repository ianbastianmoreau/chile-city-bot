const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('solicitarrol')
    .setDescription('Solicitar rol')
    .addStringOption(opt => opt.setName('rol').setDescription('Rol solicitado').setRequired(true))
    .addStringOption(opt => opt.setName('pruebas').setDescription('Pruebas').setRequired(true)),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor("#00bfff")
      .setTitle("📩 SOLICITUD DE ROL")
      .setDescription(`
👤 Usuario: ${interaction.user}
🎭 Rol: ${interaction.options.getString('rol')}
📸 Pruebas: ${interaction.options.getString('pruebas')}
      `);

    await interaction.reply({ embeds: [embed] });
  }
};