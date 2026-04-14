const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  patente: { type: String, unique: true },
  nombre: String,
  rut: String,
  vehiculo: String,

  oficial: String,
  institucion: String,
  motivo: String,
  multa: String,
  fecha: String
});

module.exports = mongoose.model("Corral", schema);