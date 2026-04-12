module.exports = {
  name: "eliminardni",

  async execute(message, args, client) {

    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Sin permisos.");

    const user = message.mentions.users.first();
    if (!user) return message.reply("❌ Menciona usuario.");

    delete client.db.dni[user.id];
    client.saveDB();

    message.reply("✅ DNI eliminado.");
  }
};