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
    .setDescription('Advertir a un usuario')
    .addUserOption(o =>
      o.setName('usuario')
        .setDescription('Usuario a advertir')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('motivo')
        .setDescription('Motivo de la advertencia')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('numero')
        .setDescription('Nivel de advertencia (1-5)')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    if (!interaction.client.tienePermiso(interaction.member, "advertencia"))
      return interaction.editReply("❌ No tienes permisos.");

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');
    const num = interaction.options.getInteger('numero');

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      return interaction.editReply("❌ Usuario no encontrado.");
    }

    const db = interaction.client.db;
    db.advertencias[user.id] ||= [];

    db.advertencias[user.id].push({
      motivo,
      nivel: num,
      staff: interaction.user.id,
      fecha: new Date().toISOString()
    });

    interaction.client.saveDB();

    const role = interaction.guild.roles.cache.get(advertRoles[num]);
    if (role) await member.roles.add(role).catch(() => {});

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("⚠️ ADVERTENCIA")
      .setDescription(`👤 <@${user.id}>\n📌 ${motivo}\n🔢 ${num}/5\n👮 ${interaction.user}`)
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};