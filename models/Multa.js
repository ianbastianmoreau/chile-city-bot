const mongoose = require("mongoose");

const multaSchema = new mongoose.Schema({
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
  vehiculo: String
});

module.exports = mongoose.model("Multa", multaSchema);