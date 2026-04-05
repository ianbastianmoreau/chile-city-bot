const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const STAFF_ROLE_ID = "1487107921711206481";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear usuario')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(opt => opt.setName('motivo').setDescription('Motivo').setRequired(true)),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');

    const embed = new EmbedBuilder()
      .setColor("#8b0000")
      .setTitle("🔨 BANEO")
      .setDescription(`
👤 Usuario: ${user}
📌 Motivo: ${motivo}
👮 Staff: ${interaction.user}
      `);

    await interaction.reply({ embeds: [embed] });
  }
};