const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const advertRoles = {
  1: "1490544727299326052",
  2: "1490544735721361570",
  3: "1490544740498800810",
  4: "1490544744219152466",
  5: "1490544747628990494"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advertencia')
    .setDescription('Advertir usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true))
    .addIntegerOption(o => o.setName('numero').setDescription('Nivel').setMinValue(1).setMaxValue(5).setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    if (!interaction.client.tienePermiso(interaction.member, "advertencia", interaction.client)) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('usuario');
    const member = interaction.guild.members.cache.get(user.id);
    const num = interaction.options.getInteger('numero');

    try {
      const role = interaction.guild.roles.cache.get(advertRoles[num]);
      if (role && member) await member.roles.add(role);
    } catch {}

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("⚠️ ADVERTENCIA")
      .setDescription(`
👤 Usuario: <@${user.id}>
📌 Motivo: ${interaction.options.getString('motivo')}
🔢 Nivel: ${num}/5
👮 Staff: ${interaction.user}
      `)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};