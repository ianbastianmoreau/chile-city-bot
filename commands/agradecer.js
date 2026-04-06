module.exports = {
  name: "agradecer",
  async execute(message, args) {

    const user = message.mentions.users.first();
    const nivel = args[1];

    if (!user) return message.reply("❌ Menciona usuario.");

    message.channel.send(`💎 Gracias ${user} por boost nivel ${nivel}`);
  }
};