const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comunicado')
    .setDescription('Enviar comunicado')
    .addStringOption(o => o.setName('titulo').setRequired(true))
    .addStringOption(o => o.setName('mensaje').setRequired(true))
    .addStringOption(o => o.setName('autor').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(interaction.options.getString('titulo'))
      .setDescription(interaction.options.getString('mensaje'))
      .setFooter({ text: `Atentamente: ${interaction.options.getString('autor')}` });

    await interaction.channel.send({ content: "@everyone", embeds: [embed] });
    await interaction.editReply("✅ Enviado");
  }
};