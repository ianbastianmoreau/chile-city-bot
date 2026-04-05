module.exports = {
  name: "encuesta",
  async execute(message, args) {
    const votos = args[0] || "10";

    const msg = await message.channel.send(`
I ¿Abrimos Servidor?

I Mínima Votos (${votos}) y Abrimos Servidor

I <:emoji_97:1485677211745783818> I Me Uno

I ❌ I No me Uno

I Host: ${message.author}

I @everyone
    `);

    await msg.react("❌");
  }
};