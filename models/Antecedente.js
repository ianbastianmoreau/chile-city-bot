const mongoose = require("mongoose");

const AntecedenteSchema = new mongoose.Schema({

  userId: String,
  nombre: String,
  rut: String,
  delitos: String,
  foto: String,

  placa: String,
  rango: String,
  dispositivo: String,
  comisaria: String,
  tipo: String,

  lugar: String,
  fecha: String,
  fiscal: String

});

module.exports = mongoose.model("Antecedente", AntecedenteSchema);