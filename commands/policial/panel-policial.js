const Antecedente = require("../../models/Antecedente");
const Multa = require("../../models/Multa");
const Corral = require("../../models/Corral");

module.exports = {
  name: "panel-policial",

  async execute(message, args) {

    const rut = args[0];
    if (!rut) return;

    const a = await Antecedente.find({ rut });
    const m = await Multa.find({ rut });
    const c = await Corral.find({ rut });

    message.reply(`
📊 PANEL POLICIAL

🆔 ${rut}

📋 Antecedentes: ${a.length}
💸 Multas: ${m.length}
🚨 Corrales: ${c.length}
    `);
  }
};