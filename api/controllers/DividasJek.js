const DividaJek = require("../modules/jekModeloDivida"); //modelo para a divida de um Jeker
const mongoose = require("mongoose"); //preciso do mongoose para construir uma divida.


//controler para criar uma divida de um Jeker daí o nome "criar_divida_jeK"
exports.criar_divida_jeK=(req,res,next)=>{

    //constructor onde vou passar a data da divida.
    let divida = new DividaJek({
        _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.
        
        //Estamos no request de um Jeker:
        useraqueDeve: "JeKnowledge",//Vai ser a Jeknowledge neste caso 

        useraDever: , //*é o próprio user que pede*
        quantia: req.body.quantia, //vai buscar a quantia ao body do json
        descricao: req.body.descricao //e se existir a descrição vou buscar tambem.
    });

    //salvo a divida
    divida
    .save()
    .then(result =>{  
        res.status(201).json({
            //codigo 201 para indicar que foi tudo feito com sucesso
            //para confirmar passo um json com uma messagem, eventuais warnings(que por agora não existem) e a divida criada
            message: 'Divida criada!', 
            DividaCriada: {
                //passo o nome, a quantia e o id criados da divida e um request 
                useraqueDeve: ,//é o nome do user 
                useraDever: "JeKnowledge", //Vai ser  Jeknowledge 
                quantia: result.quantia,
                descricao: result.descricao,
                _id: result._id,
                request:{
                    type: 'POST', //o tipo e um POST
                    url: req.protocol + '://' + req.get('host') + req.originalUrl + "/"+ result._id //formatei uma string para apresentar o url da divida (pode se tirar acho que quando fizeremos tudo vai se ligar tudo)
                }
            }
        });
    })
    .catch(err =>{
        //catch eventuias erros
        // *Debug purposes*-console.log(err); 
        res.status(500).json({
            //apresento eventuais eros
            error: err
      });
    });
};

