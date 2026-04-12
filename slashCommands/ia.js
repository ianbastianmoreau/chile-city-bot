const { SlashCommandBuilder } = require('discord.js');
const { setPersonality } = require('../utils/ia');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ia')
    .setDescription('Configurar IA')
    .addStringOption(o =>
      o.setName('modo')
        .setDescription('Tipo de IA')
        .setRequired(true)
        .addChoices(
          { name: 'Normal', value: 'normal' },
          { name: 'Serio', value: 'serio' },
          { name: 'Troll', value: 'troll' }
        )
    ),

  async execute(interaction) {
    const modo = interaction.options.getString('modo');

    setPersonality(interaction.user.id, modo);

    return interaction.reply(`🧠 IA cambiada a modo **${modo}**`);
  }
};