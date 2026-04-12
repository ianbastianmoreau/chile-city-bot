const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ver-advertencias')
    .setDescription('Ver advertencias de un usuario')
    .addUserOption(o =>
      o.setName('usuario')
        .setDescription('Usuario a revisar')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const data = interaction.client.db.advertencias[user.id] || [];

    if (data.length === 0) {
      return interaction.reply({ content: "✅ Sin advertencias.", ephemeral: true });
    }

    const desc = data.map((a, i) =>
      `#${i + 1} • Nivel ${a.nivel}\n📌 ${a.motivo}`
    ).join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle(`⚠️ Advertencias de ${user.username}`)
      .setDescription(desc)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};