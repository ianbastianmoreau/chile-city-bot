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
      o.setName('staff').setDescription('Staff').setRequired(true))
    .addStringOption(o =>
      o.setName('razon').setDescription('Razón').setRequired(true))
    .addIntegerOption(o =>
      o.setName('numero')
        .setDescription('Nivel de sanción')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)),

  async execute(interaction) {

    if (!interaction.client.tienePermiso(interaction.member, "sancionstaff", interaction.client)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const user = interaction.options.getMember('staff');
    const nivel = interaction.options.getInteger('numero');

    const role = interaction.guild.roles.cache.get(staffRoles[nivel]);
    if (role) await user.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("#ff5555")
      .setTitle("🛡️ SANCIÓN STAFF")
      .setDescription(`
👮 Staff: ${user}
📌 Razón: ${interaction.options.getString('razon')}
🔢 Nivel: ${nivel}/5
👤 Responsable: ${interaction.user}

⚠️ El incumplimiento reiterado puede llevar a la expulsión del staff.
      `)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};