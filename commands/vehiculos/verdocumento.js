const { EmbedBuilder } = require("discord.js");
const Vehiculo = require("../../models/Vehiculo");
const Corral = require("../../models/Corral");

module.exports = {
  name: "ver-documento",

  async execute(message, args) {

    if (!args[0])
      return message.reply("❌ Uso: ch!ver-documento patente");

    const patente = args[0].toUpperCase();

    const vehiculo = await Vehiculo.findOne({ patente });
    if (!vehiculo) return message.reply("❌ Vehículo no encontrado.");

    // 🔥 VERIFICAR SI ESTÁ EN CORRALES
    const incautado = await Corral.findOne({ patente });

    let estado = "🟢 Vehículo Disponible";
    let detalle = "Sin problemas";

    if (incautado) {
      estado = "🚨 VEHÍCULO INCAUTADO";
      detalle = `Incautado por ${incautado.institucion}`;
    }

    const embed = new EmbedBuilder()
      .setColor(incautado ? "Red" : "Green")
      .setTitle("📄 DOCUMENTO VEHICULAR")
      .setDescription(`
🚗 Vehículo: ${vehiculo.marca} ${vehiculo.modelo}
🔖 Patente: ${vehiculo.patente}
📅 Año: ${vehiculo.año}

👤 Propietario: ${vehiculo.nombre}
🆔 RUT: ${vehiculo.rut}
🎮 Roblox: ${vehiculo.roblox}

📄 Permiso Circulación: ${vehiculo.permiso}
🔧 Revisión Técnica: ${vehiculo.revision}

📊 Estado: ${estado}
📌 Detalle: ${detalle}
      `)
      .setFooter({ text: "Registro Nacional de Vehículos | Chile City RP" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};