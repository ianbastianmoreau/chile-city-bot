const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const staffRoles = {
  1: "1490546310502154261",
  2: "1490546333831004421",
  3: "1490546363413565460",
  4: "1490546405553737768",
  5: "1490546431734583456"
};

const MAX_SANCIONES_STAFF_DIA = 3;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancionstaff')
    .setDescription('Sancionar miembro del staff')
    .addUserOption(o =>
      o.setName('staff').setDescription('Usuario').setRequired(true))
    .addStringOption(o =>
      o.setName('razon').setDescription('Razón').setRequired(true))
    .addIntegerOption(o =>
      o.setName('numero')
        .setDescription('Nivel (1-5)')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const client = interaction.client;

    // 🔐 PERMISOS
    if (!client.tienePermiso(interaction.member, "sancionstaff")) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('staff');
    const nivel = interaction.options.getInteger('numero');
    const razon = interaction.options.getString('razon');

    if (user.id === interaction.user.id) {
      return interaction.editReply("❌ No puedes sancionarte a ti mismo.");
    }

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      return interaction.editReply("❌ Usuario no encontrado.");
    }

    const db = client.db;

    // 📊 ANTI ABUSO STAFF
    db.staff[interaction.user.id] ||= { staffSancionesHoy: 0, ultimaAccion: Date.now() };

    const ahora = Date.now();
    const ultimo = db.staff[interaction.user.id].ultimaAccion;

    if (ahora - ultimo > 86400000) {
      db.staff[interaction.user.id].staffSancionesHoy = 0;
    }

    if (db.staff[interaction.user.id].staffSancionesHoy >= MAX_SANCIONES_STAFF_DIA) {
      return interaction.editReply("🚫 Límite diario de sanciones staff alcanzado.");
    }

    db.staff[interaction.user.id].staffSancionesHoy++;
    db.staff[interaction.user.id].ultimaAccion = ahora;

    // 📂 HISTORIAL STAFF
    db.staff[user.id] ||= { historial: [] };

    db.staff[user.id].historial ||= [];

    db.staff[user.id].historial.push({
      razon,
      nivel,
      responsable: interaction.user.id,
      fecha: new Date().toISOString()
    });

    client.saveDB();

    // 🎭 DAR ROL
    try {
      const role = interaction.guild.roles.cache.get(staffRoles[nivel]);
      if (role) await member.roles.add(role);
    } catch {}

    // 📁 LOG
    client.log(interaction.guild,
      `🛡️ Sanción STAFF\nUsuario: ${user.tag}\nNivel: ${nivel}\nAdmin: ${interaction.user.tag}`
    );

    // 📦 EMBED
    const embed = new EmbedBuilder()
      .setColor("#ff5555")
      .setTitle("🛡️ SANCIÓN STAFF")
.setDescription(`
👮 Staff: <@${user.id}>
📌 Razón: ${razon}
🔢 Nivel: ${nivel}/5
👤 Responsable: ${interaction.user}

📊 Total sanciones: ${db.staff[user.id].historial.length}
⚠️ Puede llevar a expulsión del staff.
      `)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};