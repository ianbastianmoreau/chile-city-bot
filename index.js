const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Map();

// Cargar comandos
const path = require('path');

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "ch!";

  // 📌 COMANDOS
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) command.execute(message, args);
  }

  // 🧠 IA CONVERSACIONAL (MEJORADA)
  if (message.mentions.has(client.user)) {
    const msg = message.content.toLowerCase();

    if (msg.includes("hola")) {
      return message.reply("👋 Hola, bienvenido a Chile City Roleplay ¿en qué te ayudo?");
    }

    if (msg.includes("como entro") || msg.includes("entrar")) {
      return message.reply("Debes esperar una apertura o usar el código ChileCity dentro del juego.");
    }

    if (msg.includes("staff")) {
      return message.reply("Puedes calificar staff usando ch!calificar o postular en el canal correspondiente.");
    }

    if (msg.includes("bug")) {
      return message.reply("Puedes reportar bugs usando ch!bugs.");
    }

    return message.reply("🤖 Estoy aquí para ayudarte. Usa ch!soporte si necesitas comandos.");
  }
});

client.login(process.env.TOKEN);