const { EmbedBuilder } = require("discord.js");
const DNI = require("../models/dni.js");
const {
  generarRUT,
  generarProblema,
  generarVencimiento,
  getRobloxData
} = require("../utils/functions");

module.exports = {
  name: "creardni",

  async execute(message, args) {

    if (args.length < 8)
      return message.reply("❌ Uso: ch!creardni nombre1 nombre2 apellido1 apellido2 edad nacionalidad genero altura ojos usuarioRoblox");

    const [n1, n2, a1, a2, edad, nacionalidad, genero, altura, ojos, roblox] = args;

    const existente = await DNI.findOne({ userId: message.author.id });
    if (existente) return message.reply("❌ Ya tienes DNI.");

    const robloxData = await getRobloxData(roblox);
    if (!robloxData) return message.reply("❌ Usuario de Roblox inválido.");

    const dni = new DNI({
      userId: message.author.id,
      nombres: `${n1} ${n2}`,
      apellidos: `${a1} ${a2}`,
      rut: generarRUT(),
      edad,
      nacionalidad,
      genero,
      altura,
      ojos,
      problemas: generarProblema(),
      roblox,
      robloxId: robloxData.id,
      robloxAvatar: robloxData.avatar,
      vencimiento: generarVencimiento()
    });

    await dni.save();

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🪪 DNI REGISTRADO")
      .setDescription(`
👤 ${dni.nombres} ${dni.apellidos}
🆔 ${dni.rut}
🎂 ${dni.edad}
🌎 ${dni.nacionalidad}
⚧ ${dni.genero}
📏 ${dni.altura}
👁 ${dni.ojos}
🧠 ${dni.problemas}
🎮 ${dni.roblox}
📅 Vence: ${dni.vencimiento}
      `)
      .setImage(dni.robloxAvatar)
      .setFooter({ text: "Registro exitoso" });

    message.reply({ embeds: [embed] });
  }
};