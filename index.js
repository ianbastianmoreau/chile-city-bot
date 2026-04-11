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
// 🧠 BASE DE DATOS (JSON)
// =======================
const dbPath = './data.json';

let db = {};
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath));
}

// estructura base (anti errores)
db.sanciones = db.sanciones || {};
db.advertencias = db.advertencias || {};
db.staff = db.staff || {};
db.activity = db.activity || {};
db.verificaciones = db.verificaciones || {};

function saveDB() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}


// =======================
// 🤖 CLIENTE
// =======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 👉 ahora sí (ANTES estaba mal)
client.db = db;
client.saveDB = saveDB;


// =======================
// 📌 CONFIG
// =======================
const CANAL_VERIFICACION = "ID_CANAL";
const ROL_VERIFICADO = "ID_ROL";


// =======================
// 📌 PERMISOS
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
  "sancionstaff": "1491174604167708712",
  "alerta": "1436890737202696192"
};

function tienePermiso(member, commandName) {
  const roleId = client.permisos[commandName];
  if (!roleId) return true;
  return member.roles.cache.has(roleId);
}

client.tienePermiso = tienePermiso;


// =======================
// 📂 CARGAR COMANDOS
// =======================
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// PREFIX
const prefixPath = path.join(__dirname, 'commands');
fs.readdirSync(prefixPath).forEach(file => {
  if (!file.endsWith('.js')) return;
  const cmd = require(`./commands/${file}`);
  client.prefixCommands.set(cmd.name, cmd);
});

// SLASH
const slashPath = path.join(__dirname, 'slashCommands');
fs.readdirSync(slashPath).forEach(file => {
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

const { getAIResponse } = require('./utils/ia');

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // ======================
  // 🧠 IA POR MENCIÓN
  // ======================
  if (message.mentions.has(client.user)) {

    const contenido = message.content.replace(`<@${client.user.id}>`, '').trim();

    if (!contenido) return message.reply("👀 ¿Qué necesitas?");

    await message.channel.sendTyping();

    const respuesta = await getAIResponse(message.author.id, contenido);

    return message.reply(respuesta);
  }
  
// =======================
// 💬 PREFIX
// =======================
client.on('messageCreate', async message => {
  if (message.author.bot) return;

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
// ⚡ INTERACCIONES (TODO)
// =======================
client.on('interactionCreate', async interaction => {

  // ===================
  // SLASH COMMANDS
  // ===================
  if (interaction.isChatInputCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    if (!client.tienePermiso(interaction.member, interaction.commandName)) {
      return interaction.reply({ content: "❌ No permisos", ephemeral: true });
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "❌ Error", ephemeral: true });
    }
  }


  // ===================
  // BOTÓN VERIFICAR
  // ===================
  if (interaction.isButton()) {

    if (interaction.customId === "verificar_btn") {

      const modal = new ModalBuilder()
        .setCustomId("modal_verificacion")
        .setTitle("Verificación");

      const preguntas = [
        ["roblox", "Usuario Roblox"],
        ["discord", "Usuario Discord"],
        ["ingreso", "¿Cómo ingresaste?"],
        ["exp", "Experiencia RP"],
        ["mg", "¿Qué es MG?"]
      ];

      const rows = preguntas.map(p =>
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(p[0])
            .setLabel(p[1])
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

      modal.addComponents(rows);
      return interaction.showModal(modal);
    }


    // ===================
    // BOTONES STAFF
    // ===================

    if (interaction.customId.startsWith("aceptar_")) {
      const userId = interaction.customId.split("_")[1];
      const member = await interaction.guild.members.fetch(userId);

      if (member) await member.roles.add(ROL_VERIFICADO);

      db.verificaciones[userId] = "aceptado";
      saveDB();

      return interaction.reply("✅ Aceptado");
    }

    if (interaction.customId.startsWith("rechazar_")) {
      return interaction.reply("❌ Rechazado");
    }

    if (interaction.customId.startsWith("supervisar_")) {
      const userId = interaction.customId.split("_")[1];

      const canal = await interaction.guild.channels.create({
        name: `verificacion-${userId}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: userId,
            allow: [PermissionFlagsBits.ViewChannel]
          }
        ]
      });

      return interaction.reply(`📁 ${canal}`);
    }
  }


  // ===================
  // MODAL
  // ===================
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
        .setDescription(`
👤 ${interaction.user}

🎮 ${data.roblox}
💬 ${data.discord}
📥 ${data.ingreso}
🎭 ${data.exp}
📘 ${data.mg}
        `);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`aceptar_${interaction.user.id}`).setLabel("Aceptar").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`rechazar_${interaction.user.id}`).setLabel("Rechazar").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`supervisar_${interaction.user.id}`).setLabel("Supervisar").setStyle(ButtonStyle.Secondary)
      );

      const canal = interaction.guild.channels.cache.get(CANAL_VERIFICACION);

      if (canal) {
        await canal.send({ embeds: [embed], components: [row] });
      }

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
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);