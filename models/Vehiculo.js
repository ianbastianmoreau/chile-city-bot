const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  slot: Number,
  marca: String,
  modelo: String,
  patente: String,
  año: String
});

module.exports = mongoose.model("Vehiculo", schema);