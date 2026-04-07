let contador = 1;
let meta = 10;

module.exports = {
  name: "activity",
  async execute(message, args) {

    contador++;
    meta += Math.floor(Math.random() * 3) + 1;

    const msg = await message.channel.send(`
# Activity Check ${contador}

Hola <@&1451096471922413639> de CHC:RP hoy estaremos haciendo un activity check con el objetivo de ver la actividad.

Meta actual: ${meta}

Reaccionar al mensaje!

@everyone
    `);

    await msg.react("<:emoji:1485677211745783818>");
  }
};