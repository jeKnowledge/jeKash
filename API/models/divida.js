const mongoose = require("mongoose");

//esquema de como uma divida e guardada na DB
const DividaTESScheme = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, //objeto ID da divida
    //Todos os campos como obrigatórios:
    credor: { type: mongoose.Schema.Types.ObjectID, ref: "User", required: true, unique: true},  // Conectar o devedor e o credor a um user. Unique porque só existe 1 id igual
    devedor: {  type: mongoose.Schema.Types.ObjectID, ref: "User", required: true, unique: true }, //ira sempre haver um user a dever neste scheme
    quantia: { type: Number, required: true }, //preciso de ter a certeza que a quantia é um numero
    descricao: { type: String }, //pode ter ou nao uma descricao
    paga: {type: Boolean, default: false},   // estado se a divida está ativa ou inativa. Começa com o valor ativa se nada for introduzido

    //Super importante é necessário guardar a Data da criação de uma divida de modo a calcular o tempo e a ligação com os emails!
    date: { type: String, required: true },
  },
  {
    versionKey: false, //para tirar a field que aparece sempre com a versão da chave, é desnecessário.
  }
);

module.exports = mongoose.model("DividaTES", DividaTESScheme); //exporto como DividaTES
