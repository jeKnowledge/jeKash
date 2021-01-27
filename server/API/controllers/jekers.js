const mongoose = require("mongoose");

const Jeker = require("../models/jeker");

// GET REQUEST DE TODOS OS JEKERS
exports.get_all_jekers = (req, res, next) => {
  // find() sem argumentos devolve todos os jekers
  // select() para apenas dar display daqueles elementos e nao o v_0 por exemplo
  Jeker.find()
    .select("nome departamento")
    .exec()
    .then((docs) => {
      // OUTPUT
      const response = {
        count: docs.length, // Numero total de jekers
        Jekers: docs.map((doc) => {
          // map cria um array com as informações seguintes de cada jeker
          return {
            // Return da informação dos jekers
            nome: doc.nome,
            departamento: doc.departamento,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      // se a promise der erro
      console.log("Erro get jekers");
      res.status(500).json({
        error: err,
      });
    });
};

// POST DE JEKER
exports.cria_jeker = (req, res, next) => {
  // criar objeto jeker que recebe as informações vindas do POST
  const jeker = new Jeker({
    // Vai ser criado um id automaticamente que nao voltara a ser repetido
    nome: req.body.nome,
    departamento: req.body.departamento,
  });
  // Metodo do mongoose que serve para guardar o jeker na db
  jeker
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Jeker criado com sucesso",
        createdJeker: {
          nome: result.nome,
          departamento: result.departamento,
          _id: result._id,
        },
      });
    })
    .catch((err) => {
      console.log("Nao consegui dar post jeker");
      //console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
