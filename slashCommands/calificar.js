const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calificar')
    .setDescription('Calificar staff')
    .addUserOption(opt => opt.setName('staff').setRequired(true))
    .addStringOption(opt => opt.setName('razon').setRequired(true))
    .addIntegerOption(opt => opt.setName('estrellas').setMinValue(1).setMaxValue(5).setRequired(true)),

  async execute(interaction) {

    const estrellas = "⭐".repeat(interaction.options.getInteger('estrellas'));

    const embed = new EmbedBuilder()
      .setColor("#ffd700")
      .setTitle("⭐ CALIFICACIÓN STAFF")
      .setDescription(`
👮 Staff: ${interaction.options.getUser('staff')}
📝 Razón: ${interaction.options.getString('razon')}
🌟 ${estrellas}
👤 Usuario: ${interaction.user}
      `)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};