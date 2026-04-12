const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');

require('dotenv').config();
const fs = require('fs');

// =======================
// 🤖 CLIENT (PRIMERO SIEMPRE)
// =======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =======================
// 📁 CONFIG
// =======================
const CANAL_LOGS = "1492680979154731049";
const CANAL_VERIFICACION = "ID_CANAL";
const ROL_VERIFICADO = "ID_ROL";

// =======================
// 🧠 DATABASE
// =======================
const dbPath = './data.json';

let db = {};
if (fs.existsSync(dbPath)) {
  try {
    db = JSON.parse(fs.readFileSync(dbPath));
  } catch {
    db = {};
  }
}

// estructura base (IMPORTANTE)
db.sanciones ||= {};
db.advertencias ||= {};
db.staff ||= {};
db.activity ||= {};
db.verificaciones ||= {};

function saveDB() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("❌ Error guardando DB:", err);
  }
}

client.db = db;
client.saveDB = saveDB;

// =======================
// 📁 LOGS (ARREGLADO)
// =======================
client.log = async (guild, mensaje) => {
  try {
    const canal = guild.channels.cache.get(CANAL_LOGS);
    if (!canal) return;
    canal.send(`📁 LOG\n${mensaje}`);
  } catch (err) {
    console.error("Error logs:", err);
  }
};

// =======================
// 🔐 PERMISOS (LOS TUYOS)
// =======================
client.permisos = {
  aperturaon: "1487107921711206481",
  aperturaoff: "1487107921711206481",
  encuesta: "1487107921711206481",
  activity: "1487107921711206481",
  agradecer: "1487107921711206481",
  "entrar-mod": "1487107921711206481",
  "salir-mod": "1487107921711206481",
  advertencia: "1487107921711206481",
  ban: "1491174604167708712",
  comunicado: "1491174604167708712",
  sancion: "1487107921711206481",
  sancionstaff: "1491174604167708712",
  alerta: "1436890737202696192"
};

client.tienePermiso = (member, cmd) => {
  const role = client.permisos[cmd];
  if (!role) return true;
  return member.roles.cache.has(role);
};

// =======================
// 📂 CARGAR COMANDOS
// =======================
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// PREFIX
if (fs.existsSync('./commands')) {
  fs.readdirSync('./commands').forEach(file => {
    if (!file.endsWith('.js')) return;
    const cmd = require(`./commands/${file}`);
    client.prefixCommands.set(cmd.name, cmd);
  });
}

// SLASH
if (fs.existsSync('./slashCommands')) {
  fs.readdirSync('./slashCommands').forEach(file => {
    if (!file.endsWith('.js')) return;
    const cmd = require(`./slashCommands/${file}`);
    client.slashCommands.set(cmd.data.name, cmd);
  });
}

// =======================
// 🚀 READY
// =======================
client.once('clientReady', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// =======================
// 🧠 IA MEJORADA (NO REPITE)
// =======================
const memory = {};

async function getAIResponse(userId, msg) {
  if (!memory[userId]) memory[userId] = [];

  memory[userId].push(msg);
  if (memory[userId].length > 5) memory[userId].shift();

  const lower = msg.toLowerCase();

  if (lower.includes("hola")) {
    return "👋 Hola, ¿en qué te ayudo?";
  }

  if (lower.includes("que pasa")) {
    return "Todo tranquilo 😎 ¿qué necesitas?";
  }

  if (lower.length < 3) {
    return "🤨 dime algo más claro bro";
  }

  return "🤖 Interesante... cuéntame más.";
}

// =======================
// 💬 MENSAJES
// =======================
client.on('messageCreate', async message => {
  const respuesta = await getAIResponse(message.author.id, texto);

if (!respuesta) return; // 👈 IMPORTANTE (anti spam)

return message.reply(respuesta);
  // ======================
  // 🧠 IA POR MENCIÓN
  // ======================
  if (message.mentions.has(client.user)) {
    try {
      const texto = message.content
        .replace(`<@${client.user.id}>`, '')
        .replace(`<@!${client.user.id}>`, '')
        .trim();

      if (!texto) return message.reply("👀 ¿Qué necesitas?");

      await message.channel.sendTyping();

      const respuesta = await getAIResponse(message.author.id, texto);

      return message.reply(respuesta);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Error en IA.");
    }
  }

  // ======================
  // 💬 PREFIX
  // ======================
  const prefix = "ch!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(cmdName);
  if (!command) return;

  if (!client.tienePermiso(message.member, cmdName)) {
    return message.reply("❌ No tienes permisos.");
  }

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply("❌ Error en comando.");
  }
});

// =======================
// ⚡ INTERACCIONES
// =======================
client.on('interactionCreate', async interaction => {

  if (interaction.isChatInputCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return;

    if (!client.tienePermiso(interaction.member, interaction.commandName)) {
      return interaction.reply({ content: "❌ No permisos", ephemeral: true });
    }

    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "❌ Error", ephemeral: true });
    }
  }

});

// =======================
// 🌐 RENDER FIX
// =======================
require("http").createServer((req, res) => {
  res.end("Bot activo");
}).listen(process.env.PORT || 3000);

// =======================
// 🔐 LOGIN
// =======================
client.login(process.env.TOKEN);

// =======================
// 💥 ANTI CRASH
// =======================
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);