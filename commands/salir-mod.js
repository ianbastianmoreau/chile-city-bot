const tiempos = new Map();

module.exports = {
  name: "salir-mod",
  async execute(message) {

    const inicio = tiempos.get(message.author.id);

    if (!inicio) return message.reply("❌ No estás en servicio.");

    const minutos = Math.floor((Date.now() - inicio) / 60000);

    tiempos.delete(message.author.id);

    message.reply(`🕒 Tiempo: ${minutos} minutos`);
  }
};