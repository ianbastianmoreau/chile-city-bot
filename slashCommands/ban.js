const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const STAFF_ROLE_ID = "1436890733847253062";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear usuario')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo del baneo')
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName('pruebas')
        .setDescription('Pruebas del baneo')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
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