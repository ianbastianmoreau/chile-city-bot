const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calificar')
    .setDescription('Calificar staff')
    .addUserOption(opt => opt.setName('staff').setDescription('Staff').setRequired(true))
    .addStringOption(opt => opt.setName('razon').setDescription('Razón').setRequired(true))
    .addIntegerOption(opt => opt.setName('estrellas').setDescription('1 a 5').setMinValue(1).setMaxValue(5).setRequired(true)),

  async execute(interaction) {

    const estrellas = "⭐".repeat(interaction.options.getInteger('estrellas'));

    const embed = new EmbedBuilder()
      .setColor("#ffd700")
      .setTitle("⭐ CALIFICACIÓN STAFF")
      .setDescription(`
👮 Staff: ${interaction.options.getUser('staff')}
📝 Razón: ${interaction.options.getString('razon')}
🌟 Puntuación: ${estrellas}
👤 Usuario: ${interaction.user}
      `);

    await interaction.reply({ embeds: [embed] });
  }
};