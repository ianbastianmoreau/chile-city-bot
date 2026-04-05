module.exports = {
  name: "bloquear",
  async execute(message) {

    const ROL_ID = "1487107921711206481"; // 👈 pega aquí
    const CATEGORIA_ID = "1436924006400786442"; // 👈 pega aquí

    // 🔐 Verificar rol
    if (!message.member.roles.cache.has(ROL_ID)) {
      return message.reply("❌ No tienes permisos para usar este comando.");
    }

    // 📁 Buscar canales de la categoría
    const canales = message.guild.channels.cache.filter(c =>
      c.parentId === CATEGORIA_ID && c.type === 2
    );

    if (!canales.size) {
      return message.reply("No se encontraron canales en esa categoría.");
    }

    // 🔒 Bloquear
    for (const canal of canales.values()) {
      await canal.permissionOverwrites.edit(message.guild.roles.everyone, {
        Connect: false
      });
    }

    message.channel.send("🔒 **Escenarios bloqueados correctamente.**");
  }
};