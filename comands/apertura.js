const { EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()
  .setTitle("🚨 SERVIDOR ABIERTO")
  .setDescription(`
**Chile City RolePlay**

Código: ChileCity

Recuerda leer las normas antes de entrar.

Host: ${message.author}
  `)
  .setColor("Red");

message.channel.send({ content: "@everyone", embeds: [embed] });