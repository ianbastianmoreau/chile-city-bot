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
    .addUserOption(o => o.setName('usuario').setRequired(true))
    .addStringOption(o => o.setName('motivo').setRequired(true))
    .addIntegerOption(o => o.setName('numero').setMinValue(1).setMaxValue(5).setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser('usuario');
    const member = await interaction.guild.members.fetch(user.id);
    const num = interaction.options.getInteger('numero');
    const motivo = interaction.options.getString('motivo');

    const db = interaction.client.db;

    if (!db.advertencias[user.id]) db.advertencias[user.id] = [];

    db.advertencias[user.id].push({
      motivo,
      nivel: num,
      staff: interaction.user.id,
      fecha: new Date().toISOString()
    });

    interaction.client.saveDB();

    const role = interaction.guild.roles.cache.get(advertRoles[num]);
    if (role) await member.roles.add(role);

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("⚠️ ADVERTENCIA")
      .setDescription(`
👤 <@${user.id}>
📌 ${motivo}
🔢 ${num}/5
👮 ${interaction.user}
      `);

    await interaction.editReply({ embeds: [embed] });
  }
};