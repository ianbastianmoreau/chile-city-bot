const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comunicado')
    .setDescription('Enviar comunicado oficial')
    .addStringOption(o =>
      o.setName('titulo')
        .setDescription('Título del comunicado')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('mensaje')
        .setDescription('Contenido del comunicado')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('autor')
        .setDescription('Autor del comunicado')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(interaction.options.getString('titulo'))
      .setDescription(interaction.options.getString('mensaje'))
      .setFooter({ text: `Atentamente: ${interaction.options.getString('autor')}` })
      .setTimestamp();

    await interaction.channel.send({ content: "@everyone", embeds: [embed] });
    await interaction.editReply("✅ Comunicado enviado correctamente");
  }
};