const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancion')
    .setDescription('Aplicar sanción')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(opt => opt.setName('motivo').setDescription('Motivo').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN")
      .setDescription(`
👤 Usuario: ${user}
📌 Motivo: ${motivo}
👮 Staff: ${interaction.user}
      `);

    await interaction.reply({ embeds: [embed] });
  }
};