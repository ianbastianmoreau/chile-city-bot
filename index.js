const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const dbPath = './data.json';
let db = require(dbPath);

function saveDB() {
  require('fs').writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

client.db = db;
client.saveDB = saveDB;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =======================
// 📌 PERMISOS POR COMANDO
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
  "alerta": "1436890737202696192",
 
};

function tienePermiso(member, commandName, client) {
  const roleId = client.permisos[commandName];
  if (!roleId) return true;
  return member.roles.cache.has(roleId);
}

client.tienePermiso = tienePermiso;

// =======================
// 📌 CARGAR COMANDOS
// =======================
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// PREFIX
const prefixPath = path.join(__dirname, 'commands');
const prefixFiles = fs.readdirSync(prefixPath).filter(f => f.endsWith('.js'));

for (const file of prefixFiles) {
  const command = require(`./commands/${file}`);
  client.prefixCommands.set(command.name, command);
}

// SLASH
const slashPath = path.join(__dirname, 'slashCommands');
const slashFiles = fs.readdirSync(slashPath).filter(f => f.endsWith('.js'));

for (const file of slashFiles) {
  const command = require(`./slashCommands/${file}`);
  client.slashCommands.set(command.data.name, command);
}

// =======================
// 🚀 READY
// =======================
client.on('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// =======================
// 💬 PREFIX COMMANDS
// =======================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "ch!";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  if (!client.tienePermiso(message.member, commandName, client)) {
    return message.reply("❌ No tienes permisos.");
  }

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("❌ Error en el comando.");
  }
});

// =======================
// ⚡ SLASH COMMANDS
// =======================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  if (!client.tienePermiso(interaction.member, interaction.commandName, client)) {
    return interaction.reply({ content: "❌ No tienes permisos.", ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    interaction.reply({ content: "❌ Error en el comando.", ephemeral: true });
  }
});

client.on('interactionCreate', async interaction => {

  // ======================
  // BOTÓN VERIFICACIÓN
  // ======================
  if (interaction.isButton()) {

    if (interaction.customId === 'verificar_btn') {

      const modal = new ModalBuilder()
        .setCustomId('modal_verificacion')
        .setTitle('Formulario de Verificación');

      const preguntas = [
        { id: "roblox", label: "Usuario de Roblox" },
        { id: "discord", label: "Usuario de Discord" },
        { id: "ingreso", label: "¿Cómo ingresaste?" },
        { id: "experiencia", label: "Experiencia en RP" },
        { id: "mg", label: "¿Qué es MG?" },
      ];

      const rows = preguntas.map(p =>
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(p.id)
            .setLabel(p.label)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

      modal.addComponents(rows);

      await interaction.showModal(modal);
    }

    // ======================
    // BOTONES STAFF
    // ======================

    if (interaction.customId.startsWith("aceptar_")) {
      const userId = interaction.customId.split("_")[1];
      const member = interaction.guild.members.cache.get(userId);

      if (member) {
        await member.roles.add(ROL_VERIFICADO);
      }

      await interaction.reply("✅ Usuario aceptado");
    }

    if (interaction.customId.startsWith("rechazar_")) {
      await interaction.reply("❌ Usuario rechazado");
    }

    if (interaction.customId.startsWith("supervisar_")) {
      const userId = interaction.customId.split("_")[1];
      const user = await interaction.guild.members.fetch(userId);

      const canal = await interaction.guild.channels.create({
        name: `verificacion-${user.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: userId,
            allow: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.member.roles.highest.id,
            allow: [PermissionFlagsBits.ViewChannel]
          }
        ]
      });

      await interaction.reply(`📁 Canal creado: ${canal}`);
    }
  }

  // ======================
  // MODAL RESPUESTA
  // ======================
  if (interaction.isModalSubmit()) {

    if (interaction.customId === 'modal_verificacion') {

      const embed = new EmbedBuilder()
        .setColor("#00bfff")
        .setTitle("📋 NUEVA VERIFICACIÓN")
        .setDescription(`
👤 Usuario: ${interaction.user}

🎮 Roblox: ${interaction.fields.getTextInputValue('roblox')}
💬 Discord: ${interaction.fields.getTextInputValue('discord')}
📥 Ingreso: ${interaction.fields.getTextInputValue('ingreso')}
🎭 Experiencia: ${interaction.fields.getTextInputValue('experiencia')}
📘 MG: ${interaction.fields.getTextInputValue('mg')}
        `)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`aceptar_${interaction.user.id}`)
          .setLabel("Aceptar")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`rechazar_${interaction.user.id}`)
          .setLabel("Rechazar")
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId(`supervisar_${interaction.user.id}`)
          .setLabel("Supervisar")
          .setStyle(ButtonStyle.Secondary)
      );

      const canal = interaction.guild.channels.cache.get(CANAL_VERIFICACION);

      if (canal) {
        await canal.send({
          embeds: [embed],
          components: [row]
        });
      }

      await interaction.reply({
        content: "✅ Formulario enviado correctamente",
        ephemeral: true
      });
    }
  }
});

// =======================
// 🔐 LOGIN
// =======================
client.login(process.env.TOKEN);

require("http").createServer((req, res) => {
  res.end("Bot activo");
}).listen(process.env.PORT || 3000);