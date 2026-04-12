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
    .addUserOption(o => o.setName('usuario').setRequired(true))
    .addStringOption(o => o.setName('motivo').setRequired(true))
    .addIntegerOption(o => o.setName('nivel').setMinValue(1).setMaxValue(3).setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    if (!interaction.client.tienePermiso(interaction.member, "ban")) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');
    const nivel = interaction.options.getInteger('nivel');

    if (user.id === interaction.user.id)
      return interaction.editReply("❌ No puedes banearte.");

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      return interaction.editReply("❌ Usuario no encontrado.");
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.editReply("❌ No puedes sancionar superior.");

    const db = interaction.client.db;
    db.sanciones[user.id] ||= [];

    db.sanciones[user.id].push({
      tipo: "ban",
      motivo,
      nivel,
      staff: interaction.user.id,
      fecha: new Date().toISOString()
    });

    interaction.client.saveDB();

    const role = interaction.guild.roles.cache.get(banRoles[nivel]);
    if (role) await member.roles.add(role).catch(() => {});

    interaction.client.log(interaction.guild,
      `BAN | ${user.tag} | Nivel ${nivel} | Staff: ${interaction.user.tag}`
    );

    const embed = new EmbedBuilder()
      .setColor("#8b0000")
      .setTitle("🔨 SISTEMA DE CASTIGO")
      .setDescription(`👤 <@${user.id}>\n📌 ${motivo}\n🚨 ${nombres[nivel]}\n🔢 ${nivel}/3\n👮 ${interaction.user}`)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};