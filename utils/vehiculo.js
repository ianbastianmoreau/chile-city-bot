function generarRevision() {
  const hoy = new Date();

  const meses = Math.floor(Math.random() * 12) + 1;
  hoy.setMonth(hoy.getMonth() + meses);

  const fecha = hoy.toISOString().split("T")[0];

  const vigente = Math.random() > 0.3;

  return {
    fecha,
    estado: vigente ? "VIGENTE" : "VENCIDA"
  };
}

module.exports = { generarRevision };