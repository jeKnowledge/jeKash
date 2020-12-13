const mongoose = require("mongoose");
const Divida = require("../models/divida"); //modelo para a divida do Tesoureiro
const Jeker = require("../models/jeker");

//controler para criar uma divida de um Jeker daí o nome "criar_divida_jeK"
exports.criar_divida_jeK = (req, res, next) => {
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //a string que diz a data atual
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //a string que diz o tempo atual

  //constructor onde vou passar a data da divida.
  let divida = new Divida({
    _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.

    //Estamos no request de um Jeker:
    credor: "JeKnowledge", //Vai ser a Jeknowledge neste caso
    devedor: req.body.devedor, //ATENÇÃO DAR FIX: Não sei o que meter aqui, vou buscar o email do user através do log in ??**
    quantia: req.body.quantia, //vai buscar a quantia ao body do json
    descricao: req.body.descricao, //se existir a descrição vou buscar tambem.
    date: "Data: " + date + " às: " + time, //e a data de hoje ver quanto tempo passou desde a sua criação
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
          credor: "JeKnowledge", //Vai ser  Jeknowledge
          devedor: req.body.devedor, //Não sei o que meter aqui, vou buscar o email do user através do log in ??**
          quantia: result.quantia,
          descricao: result.descricao,
          _id: result._id,
          date: result.date,
          request: {
            type: "POST", //o tipo e um POST
            url:
              req.protocol +
              "://" +
              req.get("host") +
              req.originalUrl +
              "/" +
              result._id, //formatei uma string para apresentar o url da divida (pode se tirar acho que quando fizeremos tudo vai se ligar tudo)
          },
        },
      });
    })
    .catch((err) => {
      //catch eventuias erros
      // *Debug purposes*-console.log(err);
      res.status(500).json({
        //apresento eventuais eros
        error: err,
      });
    });
};

//chamei à logica deste controller "criar_divida_Tesoureiro" visto que
//e este request que o tesoureiro vai chamar quando criar uma divida
exports.criar_divida_Tesoureiro = (req, res, next) => {
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //a string que diz a data atual
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //a string que diz o tempo atual

  let divida = new Divida({
    _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.
    credor: req.body.credor, //Vou buscar o user a que deve
    devedor: req.body.devedor, //vou buscar o user a Dever
    quantia: req.body.quantia, //vou buscar a quantia
    descricao: req.body.descricao, //vou buscar a descrição
    date: "Data: " + date + ", às " + time, //e a data de hoje ver quanto tempo passou desde a sua criação
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
          date: result.date,
          _id: result._id,
          request: {
            type: "POST", //o tipo e um POST
            url:
              req.protocol +
              "://" +
              req.get("host") +
              req.originalUrl +
              "/" +
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
    .then((docs) => {
      // array docs com todos os objetos
      // OUTPUT
      const response = {
        count: docs.length, // Numero total de dividas
        Dividas: docs.map((doc) => {
          // map cria um array com as informações seguintes de cada divida
          return {
            // Return da informação das dividas
            id: doc._id, //adicionei id porque ajuda a testar
            credor: doc.credor,
            devedor: doc.devedor,
            quantia: doc.quantia,
            descricao: doc.descricao,
            date: doc.date,
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

// ---------------------------------------------GET DIVIDAS POR DEPARTAMENTO

// INTERN
exports.dividas_intern = (req, res, next) => {
  // find() sem argumentos devolve todos as dívidas
  // select() para apenas dar display daqueles elementos e nao o v_0 por exemplo
  Divida.find()
    .select("quantia devedor credor descrição")
    .exec()
    .then((docs) => {
      let jekers = [];
      Jeker.find()
        .select("nome departamento")
        .exec() // Vamos buscar os jekers para ver em que departamento se inserem
        .then((jeker) => {
          // Basicamente aqui dentro estamos na promise da Divida e do Jeker

          // Armazenar todos os jekers no array "jekers"
          for (let i = 0; i < jeker.length; i++) {
            jekers.push(jeker[i]);
          }
          // array que vai ter todas as dividas deste departamento
          let depart = [];
          for (i = 0; i < docs.length; i++) {
            for (let j = 0; j < jekers.length; j++) {
              // Se o user for um devedor ou um credor e se o seu departamento for Intern, entao a divida adiciona-se ao array das dividas deste departamento
              if (
                (docs[i]["devedor"] === jekers[j]["nome"] ||
                  docs[i]["credor"] === jekers[j]["nome"]) &&
                jekers[j]["departamento"] == "Intern"
              ) {
                depart.push(docs[i]);
              }
            }
          }

          // OUTPUT
          const response = {
            count: depart.length, // Numero total de dividas
            Dividas: depart.map((dep) => {
              // map cria um array com as informações seguintes de cada divida
              return {
                // Return da informação das dividas
                quantia: dep.quantia,
                devedor: dep.devedor,
                credor: dep.credor,
                descrição: dep.descrição,
              };
            }),
          };
          res.status(200).json(response);
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

// TECH
exports.dividas_tech = (req, res, next) => {
  // find() sem argumentos devolve todos as dívidas
  // select() para apenas dar display daqueles elementos e nao o v_0 por exemplo
  Divida.find()
    .select("quantia devedor credor descrição")
    .exec()
    .then((docs) => {
      let jekers = [];
      Jeker.find()
        .select("nome departamento")
        .exec() // Vamos buscar os jekers para ver em que departamento se inserem
        .then((jeker) => {
          // Basicamente aqui dentro estamos na promise da Divida e do Jeker

          // Armazenar todos os jekers no array "jekers"
          for (let i = 0; i < jeker.length; i++) {
            jekers.push(jeker[i]);
          }
          // array que vai ter todas as dividas deste departamento
          let depart = [];
          for (i = 0; i < docs.length; i++) {
            for (let j = 0; j < jekers.length; j++) {
              // Se o user for um devedor ou um credor e se o seu departamento for Tech, entao a divida adiciona-se ao array das dividas deste departamento
              if (
                (docs[i]["devedor"] === jekers[j]["nome"] ||
                  docs[i]["credor"] === jekers[j]["nome"]) &&
                jekers[j]["departamento"] == "Tech"
              ) {
                depart.push(docs[i]);
              }
            }
          }

          // OUTPUT
          const response = {
            count: depart.length, // Numero total de dividas
            Dividas: depart.map((dep) => {
              // map cria um array com as informações seguintes de cada divida
              return {
                // Return da informação das dividas
                quantia: dep.quantia,
                devedor: dep.devedor,
                credor: dep.credor,
                descrição: dep.descrição,
              };
            }),
          };
          res.status(200).json(response);
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

// INNOVATION
exports.dividas_innovation = (req, res, next) => {
  // find() sem argumentos devolve todos as dívidas
  // select() para apenas dar display daqueles elementos e nao o v_0 por exemplo
  Divida.find()
    .select("quantia devedor credor descrição")
    .exec()
    .then((docs) => {
      let jekers = [];
      Jeker.find()
        .select("nome departamento")
        .exec() // Vamos buscar os jekers para ver em que departamento se inserem
        .then((jeker) => {
          // Basicamente aqui dentro estamos na promise da Divida e do Jeker

          // Armazenar todos os jekers no array "jekers"
          for (let i = 0; i < jeker.length; i++) {
            jekers.push(jeker[i]);
          }
          // array que vai ter todas as dividas deste departamento
          let depart = [];
          for (i = 0; i < docs.length; i++) {
            for (let j = 0; j < jekers.length; j++) {
              // Se o user for um devedor ou um credor e se o seu departamento for Innovation, entao a divida adiciona-se ao array das dividas deste departamento
              if (
                (docs[i]["devedor"] === jekers[j]["nome"] ||
                  docs[i]["credor"] === jekers[j]["nome"]) &&
                jekers[j]["departamento"] == "Innovation"
              ) {
                depart.push(docs[i]);
              }
            }
          }

          // OUTPUT
          const response = {
            count: depart.length, // Numero total de dividas
            Dividas: depart.map((dep) => {
              // map cria um array com as informações seguintes de cada divida
              return {
                // Return da informação das dividas
                quantia: dep.quantia,
                devedor: dep.devedor,
                credor: dep.credor,
                descrição: dep.descrição,
              };
            }),
          };
          res.status(200).json(response);
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
