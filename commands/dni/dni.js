const DNI = require("../../models/DNI.");

module.exports = {
  name: "dni",
  async execute(message, args) {

    const user = message.mentions.users.first() || message.author;

    const data = await DNI.findOne({ userId: user.id });

    if (!data) {
      return message.reply("❌ No tiene DNI.");
    }

    return message.reply(`
📄 DNI DE ${user.username}

Nombre: ${data.nombres} ${data.apellidos}
RUT: ${data.rut}
Edad: ${data.edad}
Nacionalidad: ${data.nacionalidad}
    `);
  }
};