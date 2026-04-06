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

    if (!interaction.client.tienePermiso(interaction.member, "advertencia", interaction.client)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const user = interaction.options.getMember('usuario');
    const num = interaction.options.getInteger('numero');

    const role = interaction.guild.roles.cache.get(advertRoles[num]);
    if (role) await user.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("⚠️ ADVERTENCIA")
      .setDescription(`
👤 Usuario: ${user}
📌 Motivo: ${interaction.options.getString('motivo')}
🔢 Nivel: ${num}/5
👮 Staff: ${interaction.user}
      `)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};