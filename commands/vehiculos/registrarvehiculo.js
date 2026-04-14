const { EmbedBuilder } = require("discord.js");
const Vehiculo = require("../../models/Vehiculo");

module.exports = {
  name: "registrarvehiculo",

  async execute(message, args) {

    // 👉 Validación básica
    if (args.length < 7)
      return message.reply("❌ Uso: ch!registrarvehiculo nombre rut roblox marca modelo patente año");

    const [nombre, rut, roblox, marca, modelo, patenteRaw, año] = args;

    const patente = patenteRaw.toUpperCase();

    // 🔥 FUNCIONES PRO (CHILENAS)
    const generarEstado = () => {
      return Math.random() < 0.7 ? "Vigente" : "Vencido";
    };

    const generarFecha = () => {
      const hoy = new Date();
      hoy.setMonth(hoy.getMonth() + Math.floor(Math.random() * 12));
      return hoy.toLocaleDateString("es-CL");
    };

    // 👉 Verificar si ya existe
    const existe = await Vehiculo.findOne({ patente });
    if (existe) return message.reply("❌ Esta patente ya está registrada.");

    // 🔥 CREAR VEHÍCULO
    const vehiculo = new Vehiculo({
      userId: message.author.id,

      nombre,
      rut,
      roblox,

      marca,
      modelo,
      patente,
      año,

      permiso: `${generarEstado()} (vence: ${generarFecha()})`,
      revision: `${generarEstado()} (vence: ${generarFecha()})`
    });

    await vehiculo.save();

    // 🎨 EMBED PRO
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("🚗 REGISTRO VEHICULAR EXITOSO")
      .setDescription(`
👤 Propietario: ${nombre}
🆔 RUT: ${rut}
🎮 Roblox: ${roblox}

🚗 Vehículo: ${marca} ${modelo}
🔖 Patente: ${patente}
📅 Año: ${año}

📄 Permiso Circulación: ${vehiculo.permiso}
🔧 Revisión Técnica: ${vehiculo.revision}

📊 Estado: 🟢 Registrado correctamente
      `)
      .setFooter({ text: "Registro Civil Vehicular | Chile City RP" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};