const mongoose = require("mongoose");

// Estrutura de uma Divida

const dividaSchema = mongoose.Schema({
    quantia: { type: Number, required: true}, // Dinheiro que se esta a dever
    devedor: { type: String, required: true}, // Entidade que deve dinheiro
    credor: { type: String, required: true}, // Entidade a quem devem dinheiro
    descrição: { type: String, required: true} // Motivo da divida
})

module.exports = mongoose.model("Divida", dividaSchema);