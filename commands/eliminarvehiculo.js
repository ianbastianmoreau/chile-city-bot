module.exports = {
  name: "eliminarvehiculo",
  async execute(message, args) {

    const user = message.mentions.users.first();
    const nivel = args[1];

    message.channel.send(`🗑️ Vehículo nivel ${nivel} eliminado a ${user}`);
  }
};