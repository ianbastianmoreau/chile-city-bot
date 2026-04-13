const { Schema, model } = require("mongoose");

const corralSchema = new Schema({
  userId: String,
  nombre: String,
  rut: String,

  patente: String,
  vehiculo: String,

  oficial: String,
  institucion: String,

  motivo: String,
  multa: String,

  fecha: String,
  activo: { type: Boolean, default: true }
});

module.exports = model("Corral", corralSchema);