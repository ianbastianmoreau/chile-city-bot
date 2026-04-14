const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema({
  userId: String,

  nombre: String,
  rut: String,
  roblox: String,

  marca: String,
  modelo: String,
  patente: String,
  año: String,

  permiso: String,
  revision: String
});

module.exports = mongoose.model("Vehiculo", vehiculoSchema);