const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ver-advertencias')
    .setDescription('Ver advertencias')
    .addUserOption(o => o.setName('usuario').setRequired(true)),

  async execute(interaction) {

    const user = interaction.options.getUser('usuario');
    const data = interaction.client.db.advertencias[user.id] || [];

    if (data.length === 0) {
      return interaction.reply("✅ Sin advertencias.");
    }

    const desc = data.map((a, i) =>
      `#${i+1} • Nivel ${a.nivel}\nMotivo: ${a.motivo}`
    ).join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle(`⚠️ Advertencias de ${user.username}`)
      .setDescription(desc);

    interaction.reply({ embeds: [embed] });
  }
};