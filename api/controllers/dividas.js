const mongoose = require("mongoose");

const Divida = require("../models/divida");
const Jeker = require("../models/jeker");

// GET REQUEST DE TODAS AS DIVIDAS
exports.get_all_dividas = (req, res, next) => {
    // find() sem argumentos devolve todos as dívidas
    Divida.find().select("quantia devedor credor descrição").exec()
    .then(docs => { // array docs com todos os objetos
        // OUTPUT
        const response = {
            count: docs.length, // Numero total de dividas
            Dividas: docs.map(doc => { // map cria um array com as informações seguintes de cada divida
                return{ // Return da informação das dividas
                    quantia: doc.quantia,
                    devedor: doc.devedor,
                    credor: doc.credor,
                    descrição: doc.descrição,
                }
            }),
        } 
        res.status(200).json(response);
    })
    .catch(err => { // se a promise der erro
        res.status(500).json({
            error: err
        });
    })
}

// POST para ajudar a testar
exports.create_divida = (req, res, next) => {
    // criar objeto divida que recebe as informações vindas do POST
    const divida = new Divida({
        // Vai ser criado um id automaticamente que nao voltara a ser repetido
        quantia: req.body.quantia,
        devedor: req.body.devedor,
        credor: req.body.credor,
        descrição: req.body.descrição
    })
    // Metodo do mongoose que serve para guardar a divida na db
    divida.save()
    .then(result => {
        res.status(201).json({
            message: "Divida criada com sucesso",
            DividaCriada: {
                quantia: result.quantia,
                devedor: result.devedor,
                credor: result.credor,
                descrição: result.descrição,
                _id: result._id,
            }
        });
    })
    .catch(err => {
        console.log(err)
         res.status(500).json({
             error: err
         })
    })
}

// ---------------------------------------------GET DIVIDAS POR DEPARTAMENTO

// INTERN
exports.dividas_intern = (req, res, next) => {
    // find() sem argumentos devolve todos as dívidas
    // select() para apenas dar display daqueles elementos e nao o v_0 por exemplo
    Divida.find().select("quantia devedor credor descrição").exec()
    .then(docs => {
        let jekers = []
        Jeker.find().select("nome departamento").exec() // Vamos buscar os jekers para ver em que departamento se inserem
        .then(jeker => {
            // Basicamente aqui dentro estamos na promise da Divida e do Jeker

            // Armazenar todos os jekers no array "jekers"
            for(let i = 0; i < jeker.length; i++){
                jekers.push(jeker[i])
            }
            // array que vai ter todas as dividas deste departamento
            let depart = []
            for(i = 0; i < docs.length; i++){
                for(let j = 0; j < jekers.length; j++){
                    // Se o user for um devedor ou um credor e se o seu departamento for Intern, entao a divida adiciona-se ao array das dividas deste departamento
                    if((docs[i]["devedor"] === jekers[j]["nome"] || docs[i]["credor"] === jekers[j]["nome"]) && (jekers[j]["departamento"] == "Intern")){
                        depart.push(docs[i])
                    }
                }
            }

            // OUTPUT
            const response = {
                count: depart.length, // Numero total de dividas
                Dividas: depart.map(dep => { // map cria um array com as informações seguintes de cada divida
                        return{ // Return da informação das dividas
                            quantia: dep.quantia,
                            devedor: dep.devedor,
                            credor: dep.credor,
                            descrição: dep.descrição
                        }
                }),
            } 
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    });
}

// TECH
exports.dividas_tech = (req, res, next) => {
    // find() sem argumentos devolve todos as dívidas
    // select() para apenas dar display daqueles elementos e nao o v_0 por exemplo
    Divida.find().select("quantia devedor credor descrição").exec()
    .then(docs => {
        let jekers = []
        Jeker.find().select("nome departamento").exec() // Vamos buscar os jekers para ver em que departamento se inserem
        .then(jeker => {
            // Basicamente aqui dentro estamos na promise da Divida e do Jeker

            // Armazenar todos os jekers no array "jekers"
            for(let i = 0; i < jeker.length; i++){
                jekers.push(jeker[i])
            }
            // array que vai ter todas as dividas deste departamento
            let depart = []
            for(i = 0; i < docs.length; i++){
                for(let j = 0; j < jekers.length; j++){
                    // Se o user for um devedor ou um credor e se o seu departamento for Tech, entao a divida adiciona-se ao array das dividas deste departamento
                    if((docs[i]["devedor"] === jekers[j]["nome"] || docs[i]["credor"] === jekers[j]["nome"]) && (jekers[j]["departamento"] == "Tech")){
                        depart.push(docs[i])
                    }
                }
            }

            // OUTPUT
            const response = {
                count: depart.length, // Numero total de dividas
                Dividas: depart.map(dep => { // map cria um array com as informações seguintes de cada divida
                        return{ // Return da informação das dividas
                            quantia: dep.quantia,
                            devedor: dep.devedor,
                            credor: dep.credor,
                            descrição: dep.descrição
                        }
                }),
            } 
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    });
}

// INNOVATION
exports.dividas_innovation = (req, res, next) => {
    // find() sem argumentos devolve todos as dívidas
    // select() para apenas dar display daqueles elementos e nao o v_0 por exemplo
    Divida.find().select("quantia devedor credor descrição").exec()
    .then(docs => {
        let jekers = []
        Jeker.find().select("nome departamento").exec()     // Vamos buscar os jekers para ver em que departamento se inserem
        .then(jeker => {
            // Basicamente aqui dentro estamos na promise da Divida e do Jeker

            // Armazenar todos os jekers no array "jekers"
            for(let i = 0; i < jeker.length; i++){
                jekers.push(jeker[i])
            }
            // array que vai ter todas as dividas deste departamento
            let depart = []
            for(i = 0; i < docs.length; i++){
                for(let j = 0; j < jekers.length; j++){
                    // Se o user for um devedor ou um credor e se o seu departamento for Innovation, entao a divida adiciona-se ao array das dividas deste departamento
                    if((docs[i]["devedor"] === jekers[j]["nome"] || docs[i]["credor"] === jekers[j]["nome"]) && (jekers[j]["departamento"] == "Innovation")){
                        depart.push(docs[i])
                    }
                }
            }

            // OUTPUT
            const response = {
                count: depart.length, // Numero total de dividas
                Dividas: depart.map(dep => { // map cria um array com as informações seguintes de cada divida
                        return{ // Return da informação das dividas
                            quantia: dep.quantia,
                            devedor: dep.devedor,
                            credor: dep.credor,
                            descrição: dep.descrição
                        }
                }),
            } 
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    });
}