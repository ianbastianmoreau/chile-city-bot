module.exports = {
  name: "bugs",
  execute(message) {
    message.channel.send(`
Tipo de Bug: (Discord, Web, Bot, Otro)
Situacion:
Pruebas:
Como Solucionarlo: (OPCIONAL)
    `);
  }
};