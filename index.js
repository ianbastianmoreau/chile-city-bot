const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔐 CONFIG
const STAFF_ROLE_ID = "1487107921711206481";

// 🧠 IA
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

// 📦 COLECCIONES SEPARADAS
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// 📂 CARGAR PREFIX COMMANDS (ch!)
const prefixPath = path.join(__dirname, 'commands');
const prefixFiles = fs.readdirSync(prefixPath).filter(file => file.endsWith('.js'));

for (const file of prefixFiles) {
  const command = require(`./commands/${file}`);
  if (command.name) {
    client.prefixCommands.set(command.name, command);
  }
}

// 📂 CARGAR SLASH COMMANDS (/)
const slashPath = path.join(__dirname, 'slashCommands');
const slashFiles = fs.readdirSync(slashPath).filter(file => file.endsWith('.js'));

for (const file of slashFiles) {
  const command = require(`./slashCommands/${file}`);
  if (command.data) {
    client.slashCommands.set(command.data.name, command);
  }
}

// 🚀 READY
client.on('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// 💬 PREFIX COMMANDS (ch!)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "ch!";

  if (message.content.startsWith(prefix)) {

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    // 🔐 SOLO STAFF
    const staffCommands = [
      "aperturaon",
      "aperturaoff",
      "bloquear",
      "desbloquear",
      "encuesta",
      "ban",
      "sancion",
      "sancionstaff"
    ];

    if (staffCommands.includes(commandName)) {
      if (!message.member.roles.cache.has(STAFF_ROLE_ID)) {
        return message.reply("❌ No tienes permisos.");
      }
    }

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("❌ Error ejecutando comando.");
    }
  }

  // 🧠 IA REAL
  if (message.mentions.has(client.user)) {
    try {

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un asistente de un servidor de roleplay llamado Chile City RP. Ayuda de forma clara, amigable y útil."
          },
          {
            role: "user",
            content: message.content
          }
        ]
      });

      return message.reply(response.choices[0].message.content);

    } catch (error) {
      console.error(error);
      return message.reply("❌ Error con la IA.");
    }
  }
});

// ⚡ SLASH COMMANDS (/)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "❌ Error ejecutando comando", ephemeral: true });
    } else {
      await interaction.reply({ content: "❌ Error ejecutando comando", ephemeral: true });
    }
  }
});

// 🔑 LOGIN
client.login(process.env.TOKEN);