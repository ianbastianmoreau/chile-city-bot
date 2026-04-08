const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "alerta",
  async execute(message, args, client) {

    // 🔐 Permisos
    if (!client.tienePermiso(message.member, "alerta", client)) {
      return message.reply("❌ No tienes permisos para usar este comando.");
    }

    // 📌 Validar tipo
    const tipo = args[0]?.toLowerCase();
    if (!tipo || !["verde", "amarilla", "roja"].includes(tipo)) {
      return message.reply("❌ Debes usar: ch!alerta (verde, amarilla, roja) (motivo)");
    }

    // 📌 Motivo
    const motivo = args.slice(1).join(" ");
    if (!motivo) {
      return message.reply("❌ Debes indicar un motivo.");
    }

    let color, titulo, descripcion;

    if (tipo === "verde") {
      color = "#00ff00";
      titulo = "🟢 ALERTA VERDE";
      descripcion = `
:green_circle: ・Alerta VERDE: Ciudad calmada, Carabineros y PDI patrullando normal. Gente civilizada (aunque pueden existir delitos menores)

Carabineros: Glock 17  
PDI: Glock 17  

📌 Motivo: ${motivo}
      `;
    }

    if (tipo === "amarilla") {
      color = "#ffff00";
      titulo = "🟡 ALERTA AMARILLA";
      descripcion = `
:yellow_circle: ・Alerta AMARILLA: Ciudad con actividad delictiva moderada, patrullajes reforzados y mayor precaución.

Carabineros: Glock 17 y MP5 en maletero  
PDI: Glock 17 y MP5 en maletero  

📌 Motivo: ${motivo}
      `;
    }

    if (tipo === "roja") {
      color = "#ff0000";
      titulo = "🔴 ALERTA ROJA";
      descripcion = `
:red_circle: ・Alerta ROJA: Situación crítica, despliegue de fuerzas especiales y alta actividad criminal.

Carabineros (G.O.P.E): Armas largas y escopetas de goma  
PDI (ERTA): Armas largas y escopetas de goma  

📌 Motivo: ${motivo}
      `;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(titulo)
      .setDescription(descripcion)
      .setFooter({ text: "Sistema de Alertas • Chile City Roleplay" })
      .setTimestamp();

    await message.channel.send({
      content: "@everyone",
      embeds: [embed]
    });
  }
};