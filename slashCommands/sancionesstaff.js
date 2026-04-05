const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const STAFF_ROLE_ID = "1487107921711206481";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancionstaff')
    .setDescription('Sancionar staff')
    .addUserOption(opt => opt.setName('staff').setRequired(true))
    .addStringOption(opt => opt.setName('razon').setRequired(true))
    .addIntegerOption(opt => opt.setName('numero').setRequired(true)),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
      return await interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN STAFF")
      .setDescription(`
👮 Staff: ${interaction.options.getUser('staff')}
📌 Razón: ${interaction.options.getString('razon')}
🔢 Nº: ${interaction.options.getInteger('numero')}/5
👤 Responsable: ${interaction.user}
      `)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};