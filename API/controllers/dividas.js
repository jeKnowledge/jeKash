const mongoose = require("mongoose");
const Divida = require("../models/divida");
const User = require("../models/users");
const jwt = require('jsonwebtoken');
//! CRIAR NA DATABASE UMA CONTA JEK DEFAULT PARA DAR AS DIVIDAS CRIADAS POR UM JEKER
const idcontaJEK = "5fdb9a550526f0142042c8f3"; //! ID DA CONTA PRINCIPAL DA JEK depois mudar para o defenitivo

//controler para criar uma divida de um User daí o nome "criar_divida_jeK"
exports.criar_divida_jeK = (req, res, next) => {
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida

 //adicionei os zeros à direita tambem porque assim fica melhor para exportar e fazer contas com as datas
  let date =
    today.getFullYear() + "-" + ("0"+(today.getMonth() + 1)).slice(-2) + "-" + ("0"+today.getDate()).slice(-2); //a string que diz a data atual
  //faço slice(-2) porque slice(-2) da me sempre os ultimos dois characteres da string, e assim se adicionar um zero a mais fico sempre com os ultimos dois characteres e portanto apaga-o
  
  let time =
     ("0"+today.getHours()).slice(-2) + ":" +  ("0"+today.getMinutes()).slice(-2) + ":" +  ("0"+today.getSeconds()).slice(-2); //a string que diz o tempo atual
  
  //validar o user authorization e retirar desse token o info dele para postar uma divida:
  var authorization = req.headers.authorization.split(" ")[1],decoded;
  try {
      decoded = jwt.verify(authorization, "secret"); //secret e a chave da authToken
      //? console.log(decoded);
  } catch (e) {
      console.log(e);
      return res.status(401).send('unauthorized'); //e porque nao foi conseguido ler o email na auth token
  }
  // * finalmente com a authtoken decoded conseguimos ter o id do user:
  let userID = decoded.userId;
  //? console.log(userID);
  //constructor onde vou passar a data da divida.
  let divida = new Divida({
    _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.

    //Estamos no request de um User:
    credor: idcontaJEK, //todo MUDAR PARA O ID DA CONTA DA JEKNOWLEDGE!
    devedor: userID, // * ID do devedor acima referido
    quantia: req.body.quantia, //vai buscar a quantia ao body do json
    descricao: req.body.descricao, //se existir a descrição vou buscar tambem.
    paga: false, // se vamos criar uma dívida não faz sentido ela estar inativa. Por isso o seu paga inicial será sempre ativa
    userCriador: userID, // Mudei isto, aqui o user que vai criar a divida vai corresponder ao userID
    date: date + "T" + time, //e a data de hoje ver quanto tempo passou desde a sua criação
    timesemailsent: 0 //para conseguir ver o limite da divida mandada e quanto ja passou o tempo
  });
 
  //salvo a divida
  divida
    .save()
    .then((result) => {
      res.status(201).json({
        //codigo 201 para indicar que foi tudo feito com sucesso
        //para confirmar passo um json com uma messagem, eventuais warnings(que por agora não existem) e a divida criada
        message: "Divida criada!",
        DividaCriada: {
          //passo o nome, a quantia e o id criados da divida e um request
          credor: result.credor, // ? ID do credor
          devedor: result.devedor, // ? ID do devedor
          quantia: result.quantia,
          descricao: result.descricao,
          paga: result.paga,
          userCriador: result.userCriador, // User que cria a divida
          _id: result._id,
          date: result.date,
          timesemailsent:result.timesemailsent,
          request: {
            type: "POST", //o tipo e um POST
            url:
              req.protocol +
              "://" +
              req.get("host") +
              req.originalUrl +
              result._id, //formatei uma string para apresentar o url da divida (pode se tirar acho que quando fizeremos tudo vai se ligar tudo)
          },
        },
      });
    })
    .catch((err) => {
      //? Debug purposes
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//chamei à logica deste controller "criar_divida_Tesoureiro" visto que
//e este request que o tesoureiro vai chamar quando criar uma divida
exports.criar_divida_Tesoureiro = (req, res, next) => {
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida

  //adicionei os zeros à direita tambem porque assim fica melhor para exportar e fazer contas com as datas
  let date =
    today.getFullYear() + "-" + ("0"+(today.getMonth() + 1)).slice(-2) + "-" + ("0"+today.getDate()).slice(-2); //a string que diz a data atual
  //faço slice(-2) porque slice(-2) da me sempre os ultimos dois characteres da string, e assim se adicionar um zero a mais fico sempre com os ultimos dois characteres e portanto apaga-o

  let time =
    ("0"+today.getHours()).slice(-2) + ":" +  ("0"+today.getMinutes()).slice(-2) + ":" +  ("0"+today.getSeconds()).slice(-2); //a string que diz o tempo atual


  // Para ir buscar o id do user logado
  const token = req.headers.authorization.split(" ")[1]; 
  const decoded = jwt.verify(token,"secret");
  const id = decoded.userId

  let divida = new Divida({
    _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.
    credor: req.body.credor, //Vou buscar o user a que deve, O EMAIL!
    devedor: req.body.devedor, //vou buscar o user a Dever atenção meter um email, O EMAIL!
    quantia: req.body.quantia, //vou buscar a quantia
    descricao: req.body.descricao, //vou buscar a descrição
    paga: false, // se vamos criar uma dívida não faz sentido ela estar inativa. Por isso o seu paga inicial será sempre ativa
    userCriador: id, // User que cria a divida
    date: date + "T" + time, //e a data de hoje ver quanto tempo passou desde a sua criação
    timesemailsent: 0
  });

  //salvo a divida
  divida
    .save()
    .then((result) => {
      res.status(201).json({
        //codigo 201 para indicar que foi tudo feito com sucesso
        //para confirmar passo um json com a messagem, eventuais warnings e a divida criada
        message: "Divida criada!",
        DividaCriada: {
          //passo o credor, o devedor, a quantia, uma eventual descrição o id criados da divida e o request que apresenta alguma informação
          credor: result.credor,
          devedor: result.devedor,
          quantia: result.quantia,
          descricao: result.descricao,
          paga: result.paga,
          userCriador: result.userCriador,
          date: result.date,
          _id: result._id,
          timesemailsent: result.timesemailsent,
          request: {
            type: "POST", //o tipo e um POST
            url:
              req.protocol +
              "://" +
              req.get("host") +
              req.originalUrl +
              result._id,
            //formatei uma string para dar o URL atual
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};



// GET REQUEST DE TODAS AS DIVIDAS
exports.get_all_dividas = (req, res, next) => {
  // find() sem argumentos devolve todos as dívidas
  Divida.find()
    .exec()
    .then((dividas) => {
      // array dividas com todos os objetos
      // OUTPUT
      const response = {
        count: dividas.length, // Numero total de dividas
        Dividas: dividas.map((divida) => {
          // map cria um array com as informações seguintes de cada divida
          return {
            // Return da informação das dividas
            id: divida._id, //adicionei id porque ajuda a testar
            paga: divida.paga,
            credor: divida.credor,
            devedor: divida.devedor,
            quantia: divida.quantia,
            descricao: divida.descricao,
            userCriador: divida.userCriador,
            date: divida.date,
            timesemailsent: divida.timesemailsent
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      // se a promise der erro
      res.status(500).json({
        error: err,
      });
    });
};


  //GET REQUEST DE TODAS AS DIVIDAS POR USER
exports.get_all_dividas_user = (req, res, next) => {
  // find() sem argumentos devolve todos as dívidas
  Divida.find()
    .exec()
    .then((dividas) => {
      // array dividas com todos os objetos
      // OUTPUT
      const response = {
        count: dividas.length, // Numero total de dividas
        Dividas: dividas.map((divida) => {
          // map cria um array com as informações seguintes de cada divida
          return {
            // Return da informação das dividas
            id: divida._id, //adicionei id porque ajuda a testar
            paga: divida.paga,
            devedor: divida.credor,
            quantia: divida.devedor,
            descricao: divida.descricao,
            date: divida.date,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      // se a promise der erro
      res.status(500).json({
        error: err,
      });
    });
};


// GET DIVIDAS ATIVAS E INATIVAS
exports.dividas_ativas_inativas = (req, res, next) => {
  let url = req.originalUrl.split("/")  // vamos buscar o dividas/ativas ou dividas/inativas e criamos uma lista com cada valor separado por /
  let estado
  if(url[2] == "ativas"){ // se for /dividas/ativas
    estado = false
  } else if(url[2] == "inativas"){ // se for /dividas/inativas
    estado = true
  } else console.log("algo de errado não está certo")

  Divida.find({paga: estado}) // vai buscar as dividas com flag especificada no estadp
    .select("quantia devedor credor descricao userCriador paga")
    .exec()
    .then((dividas) => {
      // dividas - array com todas as dívidas ativas
    
      // OUTPUT
      const response = {
        count: dividas.length, // Numero total de dividas
        Dividas: dividas.map((divida) => {
          // map cria um array com as informações seguintes de cada divida
          return {
            // Return da informação das dividas
            quantia: divida.quantia,
            devedor: divida.credor,
            credor: divida.devedor,
            descricao: divida.descricao,
            userCriador: divida.userCriador,
            paga: divida.paga
          };
        }),
      };
      res.status(200).json(response);
      //res.status(200).json({message: "ola"}); - so para testar coisas

      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
}

// GET DIVIDAS POR DEPARTAMENTO

exports.dividas_departamento = (req, res, next) => {
  const dep = req.params.departement;
  // find() devolve todos os users do departamento indicado na route
  User.find({department: dep})
  .select("_id name department")
  .exec()
  .then((users) => {
    // users - array com todos os users do departamento
      Divida.find({$or: [ // or para considerar os dois "pedidos"
                        {credor: {$in: users}},
                        {devedor: {$in: users}} 
                        ]}) // encontra todas as dividas com credores ou devedores que estão no array users
      .select("quantia devedor credor descricao userCriador")
      .exec()
      .then((dividas) => {
        // dividas - array com todas as dívidas do departamento
      
        // OUTPUT
        const response = {
          count: dividas.length, // Numero total de dividas
          Dividas: dividas.map((divida) => {
            // map cria um array com as informações seguintes de cada divida
            return {
              // Return da informação das dividas
              quantia: divida.quantia,
              devedor: divida.credor,
              credor: divida.devedor,
              descricao: divida.descricao,
              userCriador: divida.userCriador
            };
          }),
        };
        res.status(200).json(response);
        //res.status(200).json({message: "ola"}); - so para testar coisas

        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });

    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};



// Opção para dar uma divida como paga
exports.altera_divida = (req, res, next) => {

  const id_divida = req.params.dividaID // id da divida introduizdo no url

  // Isto é feito para se so quisermos mudar campos especificos e não ter de mudar tudo
  const updateOps = {};
  for( const ops of req.body){
      updateOps[ops.propName] = ops.value;
  }

  /* JSON - tem de ser desta forma para podermos usar o que temos em cima
  [
    { "propName": "paga", "value": true}
  ]
*/

// Vamos procurar a divida com o id dado no url, e atualizamos as informações que foram disponibilix«zadas no JSON
  Divida.update({_id: id_divida}, {$set: updateOps}).exec()
  .then(result => {
    console.log({id: id_divida});
    res.status(200).json({
      message: "Divida atualizada",
      request: {
        type: "GET",
        url: "http://localhost:3000/dividas/inativas"
      }
    })
  })
  .catch(err => {
      res.status(500).json({
          errors: err
      })
    });
}





