const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  nombre: String,
  rut: String,
  roblox: String,

  marca: String,
  modelo: String,
  patente: { type: String, unique: true },
  año: String,

  permiso: String,
  revision: String
});

module.exports = mongoose.model("Vehiculo", schema);