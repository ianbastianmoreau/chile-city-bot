module.exports = {
  name: "mensaje",

  async execute(message, args) {

    const texto = args.join(" ");
    if (!texto) return message.reply("❌ Escribe un mensaje.");

    await message.delete().catch(() => {});
    message.channel.send(texto);
  }
};