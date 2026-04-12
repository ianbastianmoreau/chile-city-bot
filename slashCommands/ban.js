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
      o.setName('usuario')
        .setDescription('Usuario a castigar')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('motivo')
        .setDescription('Motivo del castigo')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('nivel')
        .setDescription('Nivel de castigo (1-3)')
        .setMinValue(1)
        .setMaxValue(3)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    if (!interaction.client.tienePermiso(interaction.member, "ban"))
      return interaction.editReply("❌ No tienes permisos.");

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');
    const nivel = interaction.options.getInteger('nivel');

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      return interaction.editReply("❌ Usuario no encontrado.");
    }

    const role = interaction.guild.roles.cache.get(banRoles[nivel]);
    if (role) await member.roles.add(role).catch(() => {});

    const embed = new EmbedBuilder()
      .setColor("#8b0000")
      .setTitle("🔨 CASTIGO")
      .setDescription(`👤 <@${user.id}>\n📌 ${motivo}\n🚨 ${nombres[nivel]}\n🔢 ${nivel}/3\n👮 ${interaction.user}`)
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};