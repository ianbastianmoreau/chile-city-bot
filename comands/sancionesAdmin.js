module.exports = {
  name: "sancionesstaff",
  execute(message) {
    message.channel.send(`
Staff Sancionado:
Razon:
Sancion Nº: (1/5)
Nota: Opcional:
    `);
  }
};