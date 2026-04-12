const axios = require("axios");

function generarRUT() {
  const num = Math.floor(10000000 + Math.random() * 90000000);
  const dv = Math.floor(Math.random() * 9);
  return `${num}-${dv}`;
}

function generarProblema() {
  const lista = [
    "Ninguno",
    "Ansiedad leve",
    "Estrés crónico",
    "Hipertensión",
    "Asma"
  ];
  return lista[Math.floor(Math.random() * lista.length)];
}

function generarVencimiento() {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() + 5);
  return fecha.toISOString().split("T")[0];
}

// 🔥 ROBLOX API
async function getRobloxData(username) {
  try {
    const user = await axios.post("https://users.roblox.com/v1/usernames/users", {
      usernames: [username]
    });

    const id = user.data.data[0]?.id;
    if (!id) return null;

    const avatar = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png&isCircular=false`);

    return {
      id,
      avatar: avatar.data.data[0].imageUrl
    };

  } catch {
    return null;
  }
}

module.exports = {
  generarRUT,
  generarProblema,
  generarVencimiento,
  getRobloxData
};