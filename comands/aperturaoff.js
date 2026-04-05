module.exports = {
  name: "aperturaoff",
  execute(message) {
    message.channel.send(`
| El Servidor se encuentra cerrado

| Recordar NO unirse al servidor o serán sancionados.

| Se volverá a realizar una apertura dentro del servidor pronto...

| ¡Espero te hayas divertido!

| Host: ${message.author}
    `);
  }
};