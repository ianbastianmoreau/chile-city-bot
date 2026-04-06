const tiempos = new Map();

module.exports = {
  name: "entrar-mod",
  async execute(message) {

    tiempos.set(message.author.id, Date.now());

    message.reply(`✅ Iniciaste servicio ${message.author}`);
  }
};