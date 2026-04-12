const {
  Client,
  GatewayIntentBits,
  Collection
} = require('discord.js');

require('dotenv').config();
const fs = require('fs');
const mongoose = require("mongoose");

// =======================
// 🤖 CLIENT
// =======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =======================
// 🔥 MONGODB
// =======================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("🔥 Mongo conectado"))
.catch(err => console.error("❌ Mongo error:", err));

// =======================
// 📁 CONFIG
// =======================
const CANAL_LOGS = "1492680979154731049";

// =======================
// 📁 LOGS
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
// 🔐 PERMISOS
// =======================
client.permisos = {
  advertencia: "1487107921711206481",
  ban: "1491174604167708712",
  comunicado: "1491174604167708712",
  sancion: "1487107921711206481",
  sancionstaff: "1491174604167708712"
};

client.tienePermiso = (member, cmd) => {
  const role = client.permisos[cmd];
  if (!role) return true;
  return member.roles.cache.has(role);
};

// =======================
// 📂 COMANDOS
// =======================
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// PREFIX
const loadCommands = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      loadCommands(fullPath); // 🔁 entra a subcarpetas
    } else if (file.endsWith(".js")) {
      const command = require(fullPath);
      client.prefixCommands.set(command.name, command);
    }
  }
};

loadCommands("./commands");

// SLASH
if (fs.existsSync('./slashCommands')) {
  const slashFiles = fs.readdirSync('./slashCommands').filter(f => f.endsWith(".js"));

  for (const file of slashFiles) {
    const cmd = require(`./slashCommands/${file}`);
    if (!cmd.data) continue;
    client.slashCommands.set(cmd.data.name, cmd);
  }
}

// =======================
// 🚀 READY
// =======================
client.once('clientReady', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// =======================
// 🧠 IA SIMPLE
// =======================
const memory = {};

async function getAIResponse(userId, msg) {
  if (!memory[userId]) memory[userId] = [];

  memory[userId].push(msg);
  if (memory[userId].length > 5) memory[userId].shift();

  const lower = msg.toLowerCase();

  if (lower.includes("hola")) return "👋 Hola, ¿en qué te ayudo?";
  if (lower.includes("ip")) return "🌐 IP: ChileCity";
  if (lower.length < 3) return "🤨 dime algo más claro";

  return "🤖 No entendí bien, intenta explicar mejor.";
}

// =======================
// 💬 MENSAJES
// =======================
client.on('messageCreate', async message => {

  if (message.author.bot) return;

  const prefix = "ch!";

  // ======================
  // 💬 PREFIX COMMANDS
  // ======================
  if (message.content.startsWith(prefix)) {

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

    return; // 🔥 IMPORTANTE: corta aquí
  }

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

      if (!respuesta) return;

      return message.reply(respuesta);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error en IA.");
    }
  }

});

// =======================
// ⚡ INTERACCIONES
// =======================
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

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

});

// =======================
// 🌐 RENDER KEEP ALIVE
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