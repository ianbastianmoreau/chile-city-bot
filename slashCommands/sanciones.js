const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const sancionRoles = {
  1: "1490544752159100999",
  2: "1490544755732512909",
  3: "1490544759289155594"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancion')
    .setDescription('Aplicar sanción')
    .addUserOption(o =>
      o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o =>
      o.setName('motivo').setDescription('Motivo').setRequired(true))
    .addIntegerOption(o =>
      o.setName('nivel')
        .setDescription('Nivel')
        .setMinValue(1)
        .setMaxValue(3)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    if (!interaction.client.tienePermiso(interaction.member, "sancion")) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('usuario');
    const member = await interaction.guild.members.fetch(user.id);
    const nivel = interaction.options.getInteger('nivel');
    const motivo = interaction.options.getString('motivo');

    const db = interaction.client.db;

    // ✅ GUARDAR EN DB
    if (!db.sanciones[user.id]) {
      db.sanciones[user.id] = [];
    }

    db.sanciones[user.id].push({
      motivo,
      nivel,
      staff: interaction.user.id,
      fecha: new Date().toISOString()
    });

    interaction.client.saveDB();

    // ✅ DAR ROL
    try {
      const role = interaction.guild.roles.cache.get(sancionRoles[nivel]);
      if (role && member) await member.roles.add(role);
    } catch (err) {
      console.error("Error rol:", err);
    }

    // ✅ AUTO BAN SI LLEGA A 3
    if (db.sanciones[user.id].length >= 3) {
      const rolBan = interaction.guild.roles.cache.get("ID_BAN");
      if (rolBan && member) {
        await member.roles.add(rolBan);
      }
    }

    // ✅ EMBED
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN APLICADA")
      .setDescription(`
👤 Usuario: <@${user.id}>
📌 Motivo: ${motivo}
🔢 Nivel: ${nivel}/3
👮 Staff: ${interaction.user}
      `)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};