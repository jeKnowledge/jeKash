const mongoose = require("mongoose");

//esquema de como uma divida e guardada na DB
const DividaTESScheme = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, //objeto ID da divida
    //* Todos os campos como obrigatórios:
    credor: { type: mongoose.Schema.Types.ObjectID, ref: "User", required: true},  // Conectar o devedor e o credor a um user.
    devedor: {  type: mongoose.Schema.Types.ObjectID, ref: "User", required: true}, //ira sempre haver um user a dever neste scheme
    quantia: { type: Number, required: true }, //preciso de ter a certeza que a quantia é um numero
    descricao: { type: String }, //pode ter ou nao uma descricao
    paga: {type: Boolean, default: false, required: true},   // estado se a divida está ativa ou inativa. Começa com o valor ativa se nada for introduzido
    userCriador: {  type: mongoose.Schema.Types.ObjectID, ref: "User", required: true},  // user que cria a divida
    date: { type: String, required: true }, //Super importante é necessário guardar a Data da criação de uma divida de modo a calcular o tempo e a ligação com os emails!
    timesemailsent: {type: Number, required:true} //para conseguir ver em comparaçao com o tempo de criação o limite da divida mandada e quanto ja passou o tempo
    //*timesemailsent:0 - ainda nao passou limite
    //*timesemailsent:1 - ja passou 7 dias
    //*timesemailsent:2 - ja passou 14 dias
    //*timesemailsent:3 - ja passou 21 dias
    
  },
  {
    versionKey: false, //para tirar a field que aparece sempre com a versão da chave, é desnecessário.
  }
);

module.exports = mongoose.model("DividaTES", DividaTESScheme); //exporto como DividaTES
