const mongoose = require("mongoose");

const corralSchema = new mongoose.Schema({
  userId: String,

  nombre: String,
  rut: String,

  patente: String,
  vehiculo: String,

  oficial: String,
  institucion: String,

  motivo: String,
  multa: String,

  fecha: String
});

module.exports = mongoose.model("Corral", corralSchema);