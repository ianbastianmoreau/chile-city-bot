const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder
} = require('discord.js');

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");

// =======================
// 🤖 CLIENT
// =======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// =======================
// 🔥 MONGO
// =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Mongo conectado"))
  .catch(err => console.error("❌ Mongo error:", err));

// =======================
// 📁 CONFIG
// =======================
const CANAL_LOGS = "1492680979154731049";

// =======================
// 📁 LOGS EMBED
// =======================
client.log = async (guild, mensaje) => {
  try {
    const canal = guild.channels.cache.get(CANAL_LOGS);
    if (!canal) return;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("📁 LOG DEL SISTEMA")
      .setDescription(mensaje)
      .setTimestamp();

    canal.send({ embeds: [embed] });
  } catch (err) {
    console.error("Error logs:", err);
  }
};

// =======================
// 🔐 PERMISOS
// =======================
client.permisos = {
  comunicado: "1491174604167708712"
};

client.tienePermiso = (member, cmd) => {
  const role = client.permisos[cmd];
  if (!role) return true;
  return member.roles.cache.has(role);
};

client.permisosPolicial = {
  antecedentes: ["1482910995331420250", "1482911130732200058"],
  multas: ["1482910995331420250", "1482911130732200058", "1484669482877321306"],
  corrales: ["1482910995331420250", "1482911130732200058", "1484669482877321306"]
};

client.tienePermisoPolicial = (member, tipo) => {
  const roles = client.permisosPolicial[tipo];
  return member.roles.cache.some(r => roles.includes(r.id));
};

// =======================
// 📂 COMANDOS (FIX)
// =======================
client.prefixCommands = new Collection();

const loadCommands = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith(".js")) {
      try {
        const command = require(fullPath);

        if (!command.name) {
          console.warn(`⚠️ Comando sin nombre: ${file}`);
          continue; // 🔥 IMPORTANTE (NO return)
        }

        client.prefixCommands.set(command.name, command);
        console.log(`✅ Cargado: ${command.name}`);
      } catch (err) {
        console.error(`❌ Error cargando ${file}:`, err);
      }
    }
  }
};

// 🔥 RUTA ABSOLUTA (FIX RENDER)
loadCommands(path.join(__dirname, "commands"));

// =======================
// 💬 MENSAJES
// =======================
const cooldown = new Map();

client.on('messageCreate', async message => {

  if (message.author.bot) return;

  // 🚫 ANTI SPAM
  if (message.mentions.roles.size > 2) {
    return message.delete().catch(() => {});
  }

  const prefix = "ch!";
  if (!message.content.startsWith(prefix)) return;

  // ⏱ cooldown
  if (cooldown.has(message.author.id)) return;
  cooldown.set(message.author.id, true);
  setTimeout(() => cooldown.delete(message.author.id), 2000);

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = client.prefixCommands.get(cmd);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply("❌ Error en comando.");
  }
});

// =======================
// 🎉 BIENVENIDA
// =======================
client.on("guildMemberAdd", member => {
  const canal = member.guild.systemChannel;
  if (!canal) return;

  canal.send(`👋 Bienvenido ${member} a **Chile City RP**`);
});

// =======================
// 🚀 READY
// =======================
client.once("ready", () => {
  console.log(`🤖 Bot listo como ${client.user.tag}`);
});

// =======================
// 🔐 LOGIN
// =======================
client.login(process.env.TOKEN);

// =======================
// 💥 ANTI CRASH
// =======================
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);