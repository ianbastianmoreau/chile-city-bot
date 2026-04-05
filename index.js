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

// 📦 COLECCIONES
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

const prefix = "ch!";

// =====================
// 📌 CARGAR PREFIX COMMANDS
// =====================
const prefixPath = path.join(__dirname, 'commands');

if (fs.existsSync(prefixPath)) {
  const prefixFiles = fs.readdirSync(prefixPath).filter(file => file.endsWith('.js'));

  for (const file of prefixFiles) {
    const command = require(`./commands/${file}`);
    client.prefixCommands.set(command.name, command);
  }
}

// =====================
// 📌 CARGAR SLASH COMMANDS
// =====================
const slashPath = path.join(__dirname, 'slashCommands');

if (fs.existsSync(slashPath)) {
  const slashFiles = fs.readdirSync(slashPath).filter(file => file.endsWith('.js'));

  for (const file of slashFiles) {
    const command = require(`./slashCommands/${file}`);
    client.slashCommands.set(command.data.name, command);
  }
}

// =====================
// 🧠 IA GRATIS
// =====================
function getAIResponse(messageContent, user) {
  const msg = messageContent.toLowerCase();

  const respuestas = {
    saludo: [
      `👋 Hola ${user}, ¿en qué puedo ayudarte en Chile City Roleplay?`,
      `¡Hola ${user}! 😊 dime qué necesitas.`,
      `Buenas ${user} 👀 estoy aquí para ayudarte.`
    ],
    entrar: [
      "Debes esperar una apertura o usar el código **ChileCity** dentro del juego.",
      "El acceso se habilita cuando el servidor abre, atento a anuncios.",
      "Usa el código **ChileCity** cuando el servidor esté abierto."
    ],
    staff: [
      "Puedes calificar staff con **/calificar** o postular cuando haya cupos.",
      "El staff se gestiona por postulaciones, revisa los canales.",
      "Si tuviste problemas con staff usa los comandos correspondientes."
    ],
    bugs: [
      "Reporta bugs con **/bugs** incluyendo pruebas.",
      "Mientras más detalles des, mejor podremos solucionarlo.",
      "Usa el comando **/bugs** para reportar errores."
    ],
    comandos: [
      "Usa **ch!soporte** para ver los comandos disponibles.",
      "Los comandos están en **ch!soporte**.",
      "Si necesitas ayuda usa **ch!soporte**."
    ],
    default: [
      "🤖 No entendí bien, intenta explicar mejor o usa **ch!soporte**.",
      "Puedo ayudarte con el servidor, dame más detalles.",
      "No tengo esa info exacta, pero dime mejor qué necesitas."
    ]
  };

  const random = arr => arr[Math.floor(Math.random() * arr.length)];

  if (msg.includes("hola") || msg.includes("buenas")) return random(respuestas.saludo);
  if (msg.includes("entrar")) return random(respuestas.entrar);
  if (msg.includes("staff")) return random(respuestas.staff);
  if (msg.includes("bug")) return random(respuestas.bugs);
  if (msg.includes("comando") || msg.includes("ayuda")) return random(respuestas.comandos);

  return random(respuestas.default);
}

// =====================
// ✅ BOT LISTO
// =====================
client.once('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// =====================
// 📩 MENSAJES
// =====================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // PREFIX COMMANDS
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (command) command.execute(message, args);
  }

  // IA GRATIS
  if (message.mentions.has(client.user)) {
    const response = getAIResponse(message.content, message.author);
    return message.reply(response);
  }
});

// =====================
// ⚡ SLASH COMMANDS
// =====================
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      interaction.followUp({ content: "❌ Error ejecutando comando.", ephemeral: true });
    } else {
      interaction.reply({ content: "❌ Error ejecutando comando.", ephemeral: true });
    }
  }
});

// =====================
// 🔐 LOGIN
// =====================
client.login(process.env.TOKEN);