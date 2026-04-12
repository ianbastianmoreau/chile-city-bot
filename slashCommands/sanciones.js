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
      o.setName('usuario')
        .setDescription('Usuario a sancionar')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('motivo')
        .setDescription('Motivo de la sanción')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('nivel')
        .setDescription('Nivel (1-3)')
        .setMinValue(1)
        .setMaxValue(3)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const client = interaction.client;

    if (!client.tienePermiso(interaction.member, "sancion"))
      return interaction.editReply("❌ No tienes permisos.");

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');
    const nivel = interaction.options.getInteger('nivel');

    if (user.id === interaction.user.id)
      return interaction.editReply("❌ No puedes sancionarte.");

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      return interaction.editReply("❌ Usuario no encontrado.");
    }

    // 🔥 ANTI ABUSO
    const db = client.db;
    db.staff[interaction.user.id] ||= { count: 0, last: Date.now() };

    if (Date.now() - db.staff[interaction.user.id].last > 86400000) {
      db.staff[interaction.user.id].count = 0;
    }

    if (db.staff[interaction.user.id].count >= MAX_SANCIONES_DIA)
      return interaction.editReply("🚫 Límite diario alcanzado.");

    db.staff[interaction.user.id].count++;
    db.staff[interaction.user.id].last = Date.now();

    // 📂 DB
    db.sanciones[user.id] ||= [];

    db.sanciones[user.id].push({
      motivo,
      nivel,
      staff: interaction.user.id,
      fecha: new Date().toISOString()
    });

    client.saveDB();

    // 🎭 ROL
    const role = interaction.guild.roles.cache.get(sancionRoles[nivel]);
    if (role) await member.roles.add(role).catch(() => {});

    // AUTO BAN
    if (db.sanciones[user.id].length >= 3) {
      const rolBan = interaction.guild.roles.cache.get("ID_BAN");
      if (rolBan) await member.roles.add(rolBan);
    }

    client.log(interaction.guild, `SANCIÓN: ${user.tag}`);

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN")
      .setDescription(`
👤 <@${user.id}>
📌 ${motivo}
🔢 ${nivel}/3
👮 ${interaction.user}
📊 Total: ${db.sanciones[user.id].length}
      `)
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};