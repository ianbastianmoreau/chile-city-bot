module.exports = {
  name: "activity",
  async execute(message, args) {

    const cantidad = parseInt(args[0]);
    if (!cantidad) return message.reply("❌ Número inválido.");

    const msg = await message.channel.send("✅ Reacciona:");

    for (let i = 0; i < cantidad; i++) {
      await msg.react("✅");
    }
  }
};