module.exports = {
  name: "licencia",
  async execute(message, args) {

    const user = message.mentions.users.first();
    const tipo = args[1];

    message.channel.send(`📜 Licencia ${tipo} otorgada a ${user}`);
  }
};