const tiempos = new Map();

module.exports = {
  name: "entrar-mod",
  async execute(message) {

    tiempos.set(message.author.id, Date.now());

    message.reply(`🟢 - Moderación Iniciada  
Has iniciado tu servicio de moderación perfectamente ${message.author}`);
  }
};