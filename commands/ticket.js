const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
  name: "ticket",
  async execute(message) {

    const existing = message.guild.channels.cache.find(c =>
      c.name === `ticket-${message.author.id}`
    );

    if (existing) {
      return message.reply("❌ Ya tienes un ticket abierto.");
    }

    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    channel.send(`🎟️ Ticket creado por ${message.author}\nUn staff te atenderá pronto.`);
    message.reply("✅ Ticket creado.");
  }
};