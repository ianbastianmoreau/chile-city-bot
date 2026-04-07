const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comunicado')
    .setDescription('Enviar comunicado')
    .addStringOption(o =>
      o.setName('titulo').setDescription('Titulo').setRequired(true))
    .addStringOption(o =>
      o.setName('mensaje').setDescription('Mensaje').setRequired(true))
    .addStringOption(o =>
      o.setName('autor').setDescription('Autor').setRequired(true)),

  async execute(interaction) {

    if (!interaction.client.tienePermiso(interaction.member, "comunicado", interaction.client)) {
      return interaction.reply({ content: "❌ No permisos", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(interaction.options.getString('titulo'))
      .setDescription(interaction.options.getString('mensaje'))
      .setFooter({ text: `Atentamente: ${interaction.options.getString('autor')}` });

    await interaction.reply({ content: "@everyone", embeds: [embed] });
  }
};