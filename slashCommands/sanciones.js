const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const sancionRoles = {
  1: "1490544752159100999",
  2: "1490544755732512909",
  3: "1490544759289155594"
};

const MAX_SANCIONES_DIA = 5;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancion')
    .setDescription('Aplicar sanción a usuario')
    .addUserOption(o =>
      o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o =>
      o.setName('motivo').setDescription('Motivo').setRequired(true))
    .addIntegerOption(o =>
      o.setName('nivel')
        .setDescription('Nivel (1-3)')
        .setMinValue(1)
        .setMaxValue(3)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const client = interaction.client;

    // 🔐 PERMISOS
    if (!client.tienePermiso(interaction.member, "sancion")) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');
    const nivel = interaction.options.getInteger('nivel');

    if (user.id === interaction.user.id) {
      return interaction.editReply("❌ No puedes sancionarte a ti mismo.");
    }

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      return interaction.editReply("❌ Usuario no está en el servidor.");
    }

    const db = client.db;

    // 📊 ANTI ABUSO STAFF
    db.staff[interaction.user.id] ||= { sancionesHoy: 0, ultimaAccion: Date.now() };

    const ahora = Date.now();
    const ultimo = db.staff[interaction.user.id].ultimaAccion;

    if (ahora - ultimo > 86400000) {
      db.staff[interaction.user.id].sancionesHoy = 0;
    }

    if (db.staff[interaction.user.id].sancionesHoy >= MAX_SANCIONES_DIA) {
      return interaction.editReply("🚫 Límite diario de sanciones alcanzado.");
    }

    db.staff[interaction.user.id].sancionesHoy++;
    db.staff[interaction.user.id].ultimaAccion = ahora;

    // 📂 GUARDAR SANCIÓN
    db.sanciones[user.id] ||= [];

    db.sanciones[user.id].push({
      motivo,
      nivel,
      staff: interaction.user.id,
      fecha: new Date().toISOString()
    });

    client.saveDB();

    // 🎭 DAR ROL
    try {
      const role = interaction.guild.roles.cache.get(sancionRoles[nivel]);
      if (role) await member.roles.add(role);
    } catch {}

    // 🚨 AUTO BAN
    if (db.sanciones[user.id].length >= 3) {
      const rolBan = interaction.guild.roles.cache.get("ID_BAN");
      if (rolBan) await member.roles.add(rolBan);
    }

    // 📁 LOG
    client.log(interaction.guild,
      `⚖️ Sanción\nUsuario: ${user.tag}\nNivel: ${nivel}\nStaff: ${interaction.user.tag}`
    );

    // 📦 EMBED
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN APLICADA")
      .setDescription(`
👤 Usuario: <@${user.id}>
📌 Motivo: ${motivo}
🔢 Nivel: ${nivel}/3
👮 Staff: ${interaction.user}
📊 Total sanciones: ${db.sanciones[user.id].length}
      `)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};