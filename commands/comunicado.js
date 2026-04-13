module.exports = {
  name: "comunicado",

  async execute(message, args) {

    const texto = args.join(" ");

    if (!texto) return message.reply("❌ Escribe el comunicado.");

    message.channel.send({
      content: "@everyone\n" + texto
    });
  }
};