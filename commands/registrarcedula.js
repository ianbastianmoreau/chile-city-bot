module.exports = {
  name: "registrarcedula",
  async execute(message, args) {

    const user = message.mentions.users.first();
    const tipo = args[1];

    message.channel.send(`🪪 Cédula ${tipo} registrada a ${user}`);
  }
};