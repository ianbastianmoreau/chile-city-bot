const { Schema, model } = require("mongoose");

const vehiculoSchema = new Schema({
  userId: String,

  slot: Number, // 1, 2 o 3

  nombre: String,
  rut: String,
  roblox: String,

  marca: String,
  modelo: String,
  patente: String,
  año: String,

  creadoPor: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = model("Vehiculo", vehiculoSchema);