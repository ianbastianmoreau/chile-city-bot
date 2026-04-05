const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calificar')
    .setDescription('Calificar staff')
    .addUserOption(opt =>
      opt.setName('staff')
        .setDescription('Staff a calificar')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('razon')
        .setDescription('Razón de la calificación')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('estrellas')
        .setDescription('Cantidad de estrellas (1-5)')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)
    ),

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