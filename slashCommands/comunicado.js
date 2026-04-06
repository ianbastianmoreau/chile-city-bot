const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comunicado')
    .setDescription('Enviar comunicado')
    .addStringOption(o => o.setName('titulo').setRequired(true))
    .addStringOption(o => o.setName('mensaje').setRequired(true))
    .addStringOption(o => o.setName('autor').setRequired(true)),

  async execute(interaction) {

    if (!interaction.client.tienePermiso(interaction.member, "comunicado", interaction.client)) {
      return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(interaction.options.getString('titulo'))
      .setDescription(interaction.options.getString('mensaje'))
      .setFooter({ text: `Atentamente: ${interaction.options.getString('autor')}` })
      .setTimestamp();

    await interaction.reply({ content: "@everyone", embeds: [embed] });
  }
};