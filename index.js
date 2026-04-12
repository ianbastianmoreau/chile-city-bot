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
const path = require('path');

// =======================
// 🧠 DATABASE
// =======================
const dbPath = './data.json';

let db = {};
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath));
}

db.sanciones ||= {};
db.advertencias ||= {};
db.staff ||= {};
db.activity ||= {};
db.verificaciones ||= {};

function saveDB() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

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

client.db = db;
client.saveDB = saveDB;

// =======================
// ⚙️ CONFIG
// =======================
const CANAL_VERIFICACION = "ID_CANAL";
const ROL_VERIFICADO = "ID_ROL";

// =======================
// 🔐 PERMISOS
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
fs.readdirSync('./commands').forEach(file => {
  if (!file.endsWith('.js')) return;
  const cmd = require(`./commands/${file}`);
  client.prefixCommands.set(cmd.name, cmd);
});

// SLASH
fs.readdirSync('./slashCommands').forEach(file => {
  if (!file.endsWith('.js')) return;
  const cmd = require(`./slashCommands/${file}`);
  client.slashCommands.set(cmd.data.name, cmd);
});

// =======================
// 🚀 READY
// =======================
client.once('clientReady', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// =======================
// 🧠 IA
// =======================
const { getAIResponse } = require('./utils/ia');

// =======================
// 💬 MENSAJES (IA + PREFIX)
// =======================
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // IA por mención
  if (message.mentions.has(client.user)) {
    const texto = message.content.replace(`<@${client.user.id}>`, '').trim();

    if (!texto) return message.reply("👀 ¿Qué necesitas?");

    await message.channel.sendTyping();
    const respuesta = await getAIResponse(message.author.id, texto);

    return message.reply(respuesta);
  }

  // PREFIX
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

  // SLASH
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

  // BOTÓN
  if (interaction.isButton()) {

    if (interaction.customId === "verificar_btn") {
      const modal = new ModalBuilder()
        .setCustomId("modal_verificacion")
        .setTitle("Verificación");

      const fields = [
        ["roblox", "Usuario Roblox"],
        ["discord", "Usuario Discord"],
        ["ingreso", "¿Cómo ingresaste?"],
        ["exp", "Experiencia RP"],
        ["mg", "¿Qué es MG?"]
      ];

      const rows = fields.map(f =>
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(f[0])
            .setLabel(f[1])
            .setStyle(TextInputStyle.Short)
        )
      );

      modal.addComponents(rows);
      return interaction.showModal(modal);
    }

    if (interaction.customId.startsWith("aceptar_")) {
      const id = interaction.customId.split("_")[1];
      const member = await interaction.guild.members.fetch(id);

      if (member) await member.roles.add(ROL_VERIFICADO);

      db.verificaciones[id] = "aceptado";
      saveDB();

      return interaction.reply("✅ Aceptado");
    }

    if (interaction.customId.startsWith("rechazar_")) {
      return interaction.reply("❌ Rechazado");
    }
  }

  // MODAL
  if (interaction.isModalSubmit()) {

    if (interaction.customId === "modal_verificacion") {

      const data = {
        roblox: interaction.fields.getTextInputValue("roblox"),
        discord: interaction.fields.getTextInputValue("discord"),
        ingreso: interaction.fields.getTextInputValue("ingreso"),
        exp: interaction.fields.getTextInputValue("exp"),
        mg: interaction.fields.getTextInputValue("mg")
      };

      db.verificaciones[interaction.user.id] = data;
      saveDB();

      const embed = new EmbedBuilder()
        .setColor("#00bfff")
        .setTitle("📋 VERIFICACIÓN")
        .setDescription(`👤 ${interaction.user}`)
        .addFields(
          { name: "Roblox", value: data.roblox },
          { name: "Discord", value: data.discord },
          { name: "Ingreso", value: data.ingreso },
          { name: "Experiencia", value: data.exp },
          { name: "MG", value: data.mg }
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`aceptar_${interaction.user.id}`).setLabel("Aceptar").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`rechazar_${interaction.user.id}`).setLabel("Rechazar").setStyle(ButtonStyle.Danger)
      );

      const canal = interaction.guild.channels.cache.get(CANAL_VERIFICACION);
      if (canal) await canal.send({ embeds: [embed], components: [row] });

      return interaction.reply({ content: "✅ Enviado", ephemeral: true });
    }
  }

});

// =======================
// 🌐 WEB (RENDER FIX)
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