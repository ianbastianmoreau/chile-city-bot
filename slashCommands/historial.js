const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('historial')
    .setDescription('Ver historial de sanciones')
    .addUserOption(o =>
      o.setName('usuario').setDescription('Usuario').setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const db = interaction.client.db;

    const sanciones = db.sanciones[user.id];

    if (!sanciones || sanciones.length === 0) {
      return interaction.reply({
        content: "❌ Este usuario no tiene sanciones.",
        ephemeral: true
      });
    }

    const lista = sanciones.map((s, i) => {
      return `**${i + 1}.** Nivel ${s.nivel} | ${s.motivo}\n👮 <@${s.staff}>`;
    }).join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle(`📋 Historial de ${user.username}`)
      .setDescription(lista)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};