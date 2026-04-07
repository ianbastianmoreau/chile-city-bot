const tiempos = new Map();

module.exports = {
  name: "salir-mod",
  async execute(message) {

    const inicio = tiempos.get(message.author.id);

    if (!inicio) return message.reply("❌ Saliste de servicio correctamente.");

    const minutos = Math.floor((Date.now() - inicio) / 60000);

    tiempos.delete(message.author.id);

    message.reply(`🔴 - Moderación Finalizada  
Has finalizado tu servicio de moderación perfectamente ${message.author}

🕒 Tiempo total: ${minutos} minutos`);
  }
};