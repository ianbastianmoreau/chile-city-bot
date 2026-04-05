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

// 📦 CARGAR COMANDOS
client.commands = new Map();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name) {
    client.commands.set(command.name, command);
  }
}

// 🚀 BOT LISTO
client.on('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// 💬 MENSAJES
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "ch!";

  // 📌 COMANDOS PREFIX
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) {
      try {
        command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("❌ Hubo un error al ejecutar el comando.");
      }
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
        "Cuando haya apertura podrás entrar fácilmente con el código del servidor."
      ],

      staff: [
        "Puedes calificar al staff usando /calificar.",
        "Si quieres interactuar con staff usa los comandos disponibles como /calificar.",
        "El staff está para ayudarte, también puedes evaluarlos con /calificar."
      ],

      bugs: [
        "Puedes reportar errores usando el comando /bugs.",
        "Si encontraste un problema usa /bugs para reportarlo.",
        "Los bugs se reportan con /bugs, incluye pruebas si puedes."
      ],

      ayuda: [
        "Puedes usar ch!soporte para ver comandos disponibles.",
        "Escribe ch!soporte y verás todo lo que puedes hacer.",
        "Te recomiendo usar ch!soporte para orientarte mejor."
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

    return message.reply(
      "🤖 No entendí completamente, pero puedo ayudarte.\n👉 Usa ch!soporte o dime mejor qué necesitas."
    );
  }
});

// 🔑 LOGIN
client.login(process.env.TOKEN);