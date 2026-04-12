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

    if (!interaction.client.tienePermiso(interaction.member, "advertencia")) {
      return interaction.editReply("❌ No tienes permisos.");
    }

    const user = interaction.options.getUser('usuario');
    const motivo = interaction.options.getString('motivo');
    const num = interaction.options.getInteger('numero');

    if (user.id === interaction.user.id)
      return interaction.editReply("❌ No puedes advertirte.");

    let member;
    try {
      member = await interaction.guild.members.fetch(user.id);
    } catch {
      return interaction.editReply("❌ Usuario no encontrado.");
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.editReply("❌ No puedes sancionar a alguien superior.");

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

    interaction.client.log(interaction.guild,
      `ADVERTENCIA | ${user.tag} | Nivel ${num} | Staff: ${interaction.user.tag}`
    );

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("⚠️ ADVERTENCIA")
      .setDescription(`👤 <@${user.id}>\n📌 ${motivo}\n🔢 ${num}/5\n👮 ${interaction.user}`)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};