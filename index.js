const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =======================
// 📌 PERMISOS POR COMANDO
// =======================
client.permisos = {
  "aperturaon": "1487107921711206481",
  "aperturaoff": "1487107921711206481",
  "encuesta": "1487107921711206481",
  "activity": "1487107921711206481",
  "agradecer": "1487107921711206481",
  "entrar-mod": "1487107921711206481",
  "salir-mod": "1487107921711206481",
  "advertencia": "1487107921711206481",
  "ban": "1491174604167708712",
  "comunicado": "1491174604167708712",
  "sancion": "1487107921711206481",
  "sancionstaff": "1491174604167708712"
};

function tienePermiso(member, commandName, client) {
  const roleId = client.permisos[commandName];
  if (!roleId) return true;
  return member.roles.cache.has(roleId);
}

client.tienePermiso = tienePermiso;

// =======================
// 📌 CARGAR COMANDOS
// =======================
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// PREFIX
const prefixPath = path.join(__dirname, 'commands');
const prefixFiles = fs.readdirSync(prefixPath).filter(f => f.endsWith('.js'));

for (const file of prefixFiles) {
  const command = require(`./commands/${file}`);
  client.prefixCommands.set(command.name, command);
}

// SLASH
const slashPath = path.join(__dirname, 'slashCommands');
const slashFiles = fs.readdirSync(slashPath).filter(f => f.endsWith('.js'));

for (const file of slashFiles) {
  const command = require(`./slashCommands/${file}`);
  client.slashCommands.set(command.data.name, command);
}

// =======================
// 🚀 READY
// =======================
client.on('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// =======================
// 💬 PREFIX COMMANDS
// =======================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "ch!";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  if (!client.tienePermiso(message.member, commandName, client)) {
    return message.reply("❌ No tienes permisos.");
  }

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("❌ Error en el comando.");
  }
});

// =======================
// ⚡ SLASH COMMANDS
// =======================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  if (!client.tienePermiso(interaction.member, interaction.commandName, client)) {
    return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    interaction.reply({ content: "❌ Error en el comando.", ephemeral: true });
  }
});

// =======================
// 🔐 LOGIN
// =======================
client.login(process.env.TOKEN);