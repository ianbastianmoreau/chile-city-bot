const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const STAFF_ROLE_ID = "1487107921711206481";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sancion')
    .setDescription('Aplicar sanción')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario sancionado')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('motivo')
        .setDescription('Motivo de la sanción')
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName('pruebas')
        .setDescription('Pruebas de la sanción')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⚖️ SANCIÓN")
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