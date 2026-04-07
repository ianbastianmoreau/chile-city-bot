const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const staffRoles = {
  1: "1490546310502154261",
  2: "1490546333831004421",
  3: "1490546363413565460",
  4: "1490546405553737768",
  5: "1490546431734583456"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancionstaff')
    .setDescription('Sancionar miembro del staff')
    .addUserOption(o =>
      o.setName('staff').setDescription('Miembro del staff').setRequired(true))
    .addStringOption(o =>
      o.setName('razon').setDescription('Razón').setRequired(true))
    .addIntegerOption(o =>
      o.setName('numero')
        .setDescription('Nivel de sanción')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    if (!interaction.client.tienePermiso(interaction.member, "sancionstaff", interaction.client)) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('staff');
    const member = interaction.guild.members.cache.get(user.id);
    const nivel = interaction.options.getInteger('numero');

    try {
      const role = interaction.guild.roles.cache.get(staffRoles[nivel]);
      if (role && member) await member.roles.add(role);
    } catch (err) {
      console.error(err);
    }

    const embed = new EmbedBuilder()
      .setColor("#ff5555")
      .setTitle("🛡️ SANCIÓN STAFF")
      .setDescription(`
👮 Staff: <@${user.id}>
📌 Razón: ${interaction.options.getString('razon')}
🔢 Nivel: ${nivel}/5
👤 Responsable: ${interaction.user}

⚠️ El incumplimiento reiterado puede llevar a expulsión del staff.
      `)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};