const { Schema, model } = require("mongoose");

const multaSchema = new Schema({
  userId: String,
  nombre: String,
  rut: String,
  articulos: String,
  foto: String,

  placa: String,
  rango: String,
  dispositivo: String,
  comisaria: String,

  lugar: String,
  fecha: String,
  vehiculoIncautado: String
});

module.exports = model("Multa", multaSchema);