const mongoose = require("mongoose");

//esquema de como uma divida e guardada na DB
const DividaTESScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    //ira sempre haver um "user que deve" neste scheme
    

    //Todos os campos como obrigatórios:
    useraqueDeve: { type:String ,required:true },
    useraDever: { type:String, required:true}, //ira sempre haver um user a dever neste scheme
    quantia: {type:Number,required:true}, //preciso de ter a certeza que a quantia é um numero
    descricao: {type:String} //pode ter ou nao uma descricao
},
{
   versionKey: false //para tirar a field que aparece sempre com a versão da chave, é desnecessário.
   
});

module.exports = mongoose.model('DividaTES',DividaTESScheme); //exporto como DividaTES