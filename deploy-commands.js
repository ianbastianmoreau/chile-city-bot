require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];

const commandFiles = fs.readdirSync('./slashCommands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./slashCommands/${file}`);

  if (!command.data) {
    console.log(`❌ ERROR EN: ${file}`);
    continue;
  }

  commands.push(command.data.toJSON());
  console.log(`✅ ${file} OK`);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🚀 Subiendo comandos...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Comandos subidos correctamente');
  } catch (error) {
    console.error(error);
  }
})();