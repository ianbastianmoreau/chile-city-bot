module.exports = {
  name: "ban",
  async execute(message) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("No tienes permisos.");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply("Menciona a alguien.");

    const member = message.guild.members.cache.get(user.id);
    await member.ban();

    message.channel.send(`
${user} Has sido baneado del servidor por los siguientes motivos

Motivo:

Pruebas:

Apelable:
    `);
  }
};