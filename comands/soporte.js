module.exports = {
  name: "soporte",
  execute(message) {
    message.reply(`
📌 Comandos disponibles:

ch!apertura
ch!aperturaoff
ch!encuesta
ch!sanciones
ch!ban
ch!bloquear
ch!desbloquear
ch!solicitarrol
ch!calificar
ch!bugs
ch!sancionesstaff
    `);
  }
};