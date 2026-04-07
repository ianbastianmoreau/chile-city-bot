const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const sancionRoles = {
  1: "ID_SANCION_1",
  2: "ID_SANCION_2",
  3: "ID_SANCION_3"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancion')
    .setDescription('Aplicar sanción a usuario')
    .addUserOption(o =>
      o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o =>
      o.setName('motivo').setDescription('Motivo').setRequired(true))
    .addIntegerOption(o =>
      o.setName('numero')
        .setDescription('Nivel de sanción')
        .setMinValue(1)
        .setMaxValue(3)
        .setRequired(true)),

  async execute(interaction) {

    if (!interaction.client.tienePermiso(interaction.member, "sancion", interaction.client)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const user = interaction.options.getMember('usuario');
    const nivel = interaction.options.getInteger('numero');

    const role = interaction.guild.roles.cache.get(sancionRoles[nivel]);
    if (role) await user.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN APLICADA")
      .setDescription(`
👤 Usuario: ${user}
📌 Motivo: ${interaction.options.getString('motivo')}
🔢 Nivel: ${nivel}/3
👮 Staff: ${interaction.user}

⚠️ Acumulación de sanciones puede resultar en castigos mayores.
      `)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};