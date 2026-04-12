const mongoose = require("mongoose");

const dniSchema = new mongoose.Schema({
  userId: String,
  nombres: String,
  apellidos: String,
  rut: String,
  edad: Number,
  nacionalidad: String,
  genero: String,
  altura: String,
  ojos: String,
  problemas: String,
  roblox: String,
  vencimiento: String
});

module.exports = mongoose.model("DNI", dniSchema);