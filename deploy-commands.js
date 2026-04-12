require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];

const commandFiles = fs.readdirSync('./slashCommands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const command = require(`./slashCommands/${file}`);

    if (!command.data) {
      console.log(`❌ ${file} NO tiene data`);
      continue;
    }

    commands.push(command.data.toJSON());
    console.log(`✅ ${file} OK`);

  } catch (err) {
    console.log(`💥 ERROR EN: ${file}`);
    console.error(err);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🚀 Subiendo comandos...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Listo');
  } catch (error) {
    console.error(error);
  }
})();