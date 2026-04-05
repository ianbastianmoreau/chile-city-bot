const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const STAFF_ROLE_ID = "1487107921711206481";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear usuario')
    .addUserOption(opt => opt.setName('usuario').setRequired(true))
    .addStringOption(opt => opt.setName('motivo').setRequired(true))
    .addAttachmentOption(opt => opt.setName('pruebas').setRequired(true)),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
      return await interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#8b0000")
      .setTitle("🔨 BANEO")
      .setDescription(`
👤 Usuario: ${interaction.options.getUser('usuario')}
📌 Motivo: ${interaction.options.getString('motivo')}
👮 Staff: ${interaction.user}
      `)
      .setImage(interaction.options.getAttachment('pruebas').url)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};