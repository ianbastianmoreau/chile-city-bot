const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const sancionRoles = {
  1: "1490544752159100999",
  2: "1490544755732512909",
  3: "1490544759289155594"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancion')
    .setDescription('Sancionar usuario')
    .addUserOption(o => o.setName('usuario').setRequired(true))
    .addStringOption(o => o.setName('motivo').setRequired(true))
    .addIntegerOption(o => o.setName('numero').setMinValue(1).setMaxValue(3).setRequired(true)),

  async execute(interaction) {

    if (!interaction.client.tienePermiso(interaction.member, "sancion", interaction.client)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const user = interaction.options.getMember('usuario');
    const num = interaction.options.getInteger('numero');

    const role = interaction.guild.roles.cache.get(sancionRoles[num]);
    if (role) await user.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN")
      .setDescription(`
👤 Usuario: ${user}
📌 Motivo: ${interaction.options.getString('motivo')}
🔢 Nivel: ${num}/3
👮 Staff: ${interaction.user}
      `)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};