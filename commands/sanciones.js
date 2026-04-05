module.exports = {
  name: "sanciones",
  execute(message, args) {
    const user = message.mentions.users.first();

    message.channel.send(`
${user}

Has sido sancionado por los siguientes articulos

Articulos:

Staff Responsable: ${message.author}

Numero de sancion:

Pruebas:
    `);
  }
};