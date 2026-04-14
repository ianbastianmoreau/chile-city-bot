const generarFecha = () => {
  return new Date().toLocaleString("es-CL");
};

const generarEstado = () => {
  return Math.random() < 0.7 ? "Vigente" : "Vencido";
};

const generarVencimiento = () => {
  const fecha = new Date();
  fecha.setMonth(fecha.getMonth() + Math.floor(Math.random() * 12));
  return fecha.toLocaleDateString("es-CL");
};

// 👉 Soporta nombres con espacios usando comillas
const parseArgs = (content) => {
  const regex = /"([^"]+)"|(\S+)/g;
  const args = [];
  let match;
  while ((match = regex.exec(content))) {
    args.push(match[1] || match[2]);
  }
  return args;
};

module.exports = {
  generarFecha,
  generarEstado,
  generarVencimiento,
  parseArgs
};