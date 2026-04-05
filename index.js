const { Client, GatewayIntentBits } = require('discord.js');
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

// 📦 MAPA DE COMANDOS
client.commands = new Map();

// 📂 CARGAR TODOS LOS COMANDOS
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // Slash commands
  if (command.data) {
    client.commands.set(command.data.name, command);
  }

  // Prefix commands
  if (command.name) {
    client.commands.set(command.name, command);
  }
}

// 🚀 BOT LISTO
client.on('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// 💬 COMANDOS PREFIX (ch!)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "ch!";

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("❌ Error al ejecutar comando.");
    }
  }

  // 🧠 IA MEJORADA
  if (message.mentions.has(client.user)) {

    const msg = message.content.toLowerCase();

    const respuestas = {
      saludo: [
        "👋 ¡Hola! ¿En qué te puedo ayudar?",
        "¡Buenas! Bienvenido a Chile City RP 🚓",
        "👀 Hola, dime qué necesitas"
      ],
      entrar: [
        "Debes esperar una apertura o usar el código ChileCity dentro del juego.",
        "Para entrar necesitas que el servidor esté abierto o usar el código ChileCity.",
        "Cuando haya apertura podrás entrar fácilmente con el código."
      ],
      staff: [
        "Puedes calificar staff con /calificar.",
        "Usa /calificar para evaluar staff.",
        "El staff está para ayudarte, también puedes evaluarlos."
      ],
      bugs: [
        "Reporta errores con /bugs.",
        "Si encuentras un problema usa /bugs.",
        "Los bugs se reportan con /bugs."
      ],
      ayuda: [
        "Usa ch!soporte para ver comandos.",
        "Escribe ch!soporte para ayudarte.",
        "Te recomiendo usar ch!soporte."
      ]
    };

    function random(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    if (msg.includes("hola") || msg.includes("buenas")) {
      return message.reply(random(respuestas.saludo));
    }

    if (msg.includes("entrar") || msg.includes("codigo")) {
      return message.reply(random(respuestas.entrar));
    }

    if (msg.includes("staff") || msg.includes("admin")) {
      return message.reply(random(respuestas.staff));
    }

    if (msg.includes("bug") || msg.includes("error")) {
      return message.reply(random(respuestas.bugs));
    }

    if (msg.includes("ayuda") || msg.includes("comandos")) {
      return message.reply(random(respuestas.ayuda));
    }

    return message.reply("🤖 No entendí bien, usa ch!soporte o dime mejor qué necesitas.");
  }
});

// ⚡ SLASH COMMANDS (/)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Error al ejecutar comando', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Error al ejecutar comando', ephemeral: true });
    }
  }
});

// 🔑 LOGIN
client.login(process.env.TOKEN);