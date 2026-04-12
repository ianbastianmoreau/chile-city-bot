const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearhistorial')
    .setDescription('Limpiar historial de sanciones')
    .addUserOption(o =>
      o.setName('usuario').setDescription('Usuario').setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.client.tienePermiso(interaction.member, "sancion")) {
      return interaction.reply({ content: "❌ Sin permisos", ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');

    interaction.client.db.sanciones[user.id] = [];
    interaction.client.saveDB();

    interaction.client.log(interaction.guild,
      `Historial limpiado a ${user.tag} por ${interaction.user.tag}`
    );

    interaction.reply(`🧹 Historial limpiado para ${user}`);
  }
};