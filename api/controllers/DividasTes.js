const mongoose = require("mongoose");
const DividaTes = require("../modules/jekModeloDivida"); //modelo para a divida do Tesoureiro

//chamei à logica deste controller "criar_divida_Tesoureiro" visto que 
//e este request que o tesoureiro vai chamar quando criar uma divida
exports.criar_divida_Tesoureiro= (req,res,next)=>{
    
    let divida = new DividaTes({
        _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.
        useraqueDeve: req.body.useraqueDeve, //Vou buscar o user a que deve
        useraDever: req.body.useraDever, //vou buscar o user a Dever 
        quantia: req.body.quantia, //vou buscar a quantia
        descricao: req.body.descricao //vou buscar a descrição
    });
    //se por alguma razão deixar vazio o "useraqueDeve", o Default será JeKnowledge visto que o Tesoureiro não especificou nenhuma pessa a dever
    
    //salvo a divida
    divida
    .save()
    .then(result =>{
        res.status(201).json({
            //codigo 201 para indicar que foi tudo feito com sucesso
            //para confirmar passo um json com a messagem, eventuais warnings e a divida criada
            message: 'Divida criada!',
            DividaCriada: {
                //passo o useraqueDeve, o useraDever, a quantia, uma eventual descrição o id criados da divida e o request que apresenta alguma informação 
                useraqueDeve: result.useraqueDeve, 
                useraDever: result.useraDever,
                quantia: result.quantia,
                descricao: result.descricao,
                _id: result._id,
                request:{
                    type: 'POST', //o tipo e um POST
                    url: req.protocol + '://' + req.get('host') + req.originalUrl + "/" +result._id
                    //formatei uma string para dar o URL atual
                }
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
      });
    });
};




