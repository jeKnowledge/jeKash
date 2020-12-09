const mongoose = require("mongoose");

// Estrutura de um jeKer

const jekerSchema = mongoose.Schema({
    nome: { type: String, required: true}, // Nome do jeKer
    departamento: { type: String, required: true} // Dinheiro que se esta a dever
})

module.exports = mongoose.model("Jeker", jekerSchema);