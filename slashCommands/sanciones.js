const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const sancionRoles = {
  1: "1490544752159100999",
  2: "1490544755732512909",
  3: "1490544759289155594"
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
    await interaction.deferReply();

    if (!interaction.client.tienePermiso(interaction.member, "sancion", interaction.client)) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('usuario');
    const member = interaction.guild.members.cache.get(user.id);
    const nivel = interaction.options.getInteger('numero');

    try {
      const role = interaction.guild.roles.cache.get(sancionRoles[nivel]);
      if (role && member) await member.roles.add(role);
    } catch (err) {
      console.error(err);
    }

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN APLICADA")
      .setDescription(`
👤 Usuario: <@${user.id}>
📌 Motivo: ${interaction.options.getString('motivo')}
🔢 Nivel: ${nivel}/3
👮 Staff: ${interaction.user}

⚠️ Acumular sanciones puede llevar a castigos mayores.
      `)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};

if (!client.db.sanciones[user.id]) {
  client.db.sanciones[user.id] = [];
}

client.db.sanciones[user.id].push({
  motivo: interaction.options.getString('motivo'),
  nivel: nivel,
  staff: interaction.user.id,
  fecha: new Date().toISOString()
});

client.saveDB();