module.exports = {
  name: "entorno",

  async execute(message, args) {

    if (!args.length) {
      return message.reply("❌ Debes escribir una acción.");
    }

    const texto = args.join(" ");

    message.channel.send(`🌍 ENTORNO\n${texto}`);
  }
};