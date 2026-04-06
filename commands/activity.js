module.exports = {
  name: "activity",
  async execute(message, args) {

    const cantidad = parseInt(args[0]);
    if (!cantidad) return message.reply("❌ Número inválido.");

    const msg = await message.channel.send("Hola @✅・Miembro Verificado de CHC:RP hoy estaremos haciendo un activity ckeck, De que consiste este activity check? tomar la actividad del servidor para proximas aperturas u otro tipo de cosas.!:");

    for (let i = 0; i < cantidad; i++) {
      await msg.react("✅");
    }
  }
};