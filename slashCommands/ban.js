const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const banRoles = {
  1: "1490544766314614814",
  2: "1490544785369469008",
  3: "1490544789056262204"
};

const nombres = {
  1: "Expulsión",
  2: "Baneo",
  3: "Vetado"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Sistema de castigo escalado')
    .addUserOption(o =>
      o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o =>
      o.setName('motivo').setDescription('Motivo').setRequired(true))
    .addIntegerOption(o =>
      o.setName('nivel')
        .setDescription('Nivel de castigo')
        .setMinValue(1)
        .setMaxValue(3)
        .setRequired(true)),

  async execute(interaction) {

    if (!interaction.client.tienePermiso(interaction.member, "ban", interaction.client)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const user = interaction.options.getMember('usuario');
    const nivel = interaction.options.getInteger('nivel');

    const role = interaction.guild.roles.cache.get(banRoles[nivel]);
    if (role) await user.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("#8b0000")
      .setTitle("🔨 SISTEMA DE CASTIGO")
      .setDescription(`
👤 Usuario: ${user}
📌 Motivo: ${interaction.options.getString('motivo')}
🚨 Tipo: ${nombres[nivel]}
🔢 Nivel: ${nivel}/3
👮 Staff: ${interaction.user}

⚠️ Este castigo ha sido aplicado según normativa del servidor.
      `)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};