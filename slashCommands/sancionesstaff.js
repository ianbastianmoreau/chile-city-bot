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
      o.setName('staff')
        .setDescription('Usuario del staff')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('razon')
        .setDescription('Razón de la sanción')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('numero')
        .setDescription('Nivel de sanción (1-5)')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const client = interaction.client;

    if (!client.tienePermiso(interaction.member, "sancionstaff"))
      return interaction.editReply("❌ No tienes permisos.");

    const user = interaction.options.getUser('staff');
    const nivel = interaction.options.getInteger('numero');
    const razon = interaction.options.getString('razon');

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

    if (db.staff[interaction.user.id].count >= MAX_SANCIONES_STAFF_DIA)
      return interaction.editReply("🚫 Límite diario alcanzado.");

    db.staff[interaction.user.id].count++;
    db.staff[interaction.user.id].last = Date.now();

    // 📂 HISTORIAL
    db.staff[user.id] ||= { historial: [] };

    db.staff[user.id].historial.push({
      razon,
      nivel,
      staff: interaction.user.id,
      fecha: new Date().toISOString()
    });

    client.saveDB();

    // 🎭 ROL
    const role = interaction.guild.roles.cache.get(staffRoles[nivel]);
    if (role) await member.roles.add(role).catch(() => {});

    client.log(interaction.guild, `STAFF SANCIONADO: ${user.tag}`);

    const embed = new EmbedBuilder()
      .setColor("#ff5555")
      .setTitle("🛡️ SANCIÓN STAFF")
      .setDescription(`
👮 Staff: <@${user.id}>
📌 Razón: ${razon}
🔢 Nivel: ${nivel}/5
👤 Responsable: ${interaction.user}

📊 Total: ${db.staff[user.id].historial.length}
      `)
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};