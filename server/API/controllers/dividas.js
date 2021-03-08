const mongoose = require("mongoose");
const Divida = require("../models/divida");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
//! CRIAR NA DATABASE UMA CONTA JEK DEFAULT PARA DAR AS DIVIDAS CRIADAS POR UM JEKER
const idcontaJEK = "5fdeac8c53a6f54594acee7b"; //! ID DA CONTA PRINCIPAL DA JEK depois mudar para o defenitivo

//controler para criar uma divida de um User daí o nome "criar_divida_jeK"

exports.criar_divida_jeK = (req, res, next) => {
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida

  //adicionei os zeros à direita tambem porque assim fica melhor para exportar e fazer contas com as datas
  let date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2); //a string que diz a data atual
  //faço slice(-2) porque slice(-2) da me sempre os ultimos dois characteres da string, e assim se adicionar um zero a mais fico sempre com os ultimos dois characteres e portanto apaga-o

  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); //a string que diz o tempo atual

  devedores = [];
  devedores = req.body.divida.devedor.split(",");

  const tokenheader = req.headers.authorization;
  const token = tokenheader.split(" ")[1];
  const decoded = jwt.verify(token, "secret");
  const id = decoded.userId;

  User.findOne({
    email: req.body.divida.credor,
  })
    .exec()
    .then((user_credor) => {
      for (let i = 0; i < devedores.length; i++) {
        let devedor = devedores[i];
        devedor = devedor.trim();

        User.findOne({
          email: devedor,
        })
          .select()
          .exec()
          .then((user_devedor) => {
            let divida = new Divida({
              _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.

              //Estamos no request de um User:
              credor: user_credor._id, //todo MUDAR PARA O ID DA CONTA DA JEKNOWLEDGE!
              devedor: user_devedor._id, // * ID do devedor acima referido
              credorS: user_credor.name
                .concat(" ")
                .concat(user_credor.lastname),
              devedorS: user_devedor.name
                .concat(" ")
                .concat(user_devedor.lastname),
              quantia: req.body.divida.quantia, //vai buscar a quantia ao body do json
              descricao: req.body.divida.descricao, //se existir a descrição vou buscar tambem.
              paga: false, // se vamos criar uma dívida não faz sentido ela estar inativa. Por isso o seu paga inicial será sempre ativa
              userCriador: id, // Mudei isto, aqui o user que vai criar a divida vai corresponder ao userID
              date: date + "T" + time, //e a data de hoje ver quanto tempo passou desde a sua criação
              timesemailsent: 0, //para conseguir ver o limite da divida mandada e quanto ja passou o tempo
            });

            //salvo a divida
            divida
              .save()
              .then((result) => {
                res.status(200).json(divida);
              })
              .catch((err) => {
                res.status(404).json(err);
              });
          })
          .catch((err) => {
            res.status(404).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

//chamei à logica deste controller "criar_divida_Tesoureiro" visto que
//e este request que o tesoureiro vai chamar quando criar uma divida
exports.criar_divida_Tesoureiro = (req, res, next) => {
  //Quando uma divida é criada preciso de a data, hora e minutos de hoje.
  let today = new Date(); //com a class Date consigo pedir a data e a hora a que foi criada a divida

  //adicionei os zeros à direita tambem porque assim fica melhor para exportar e fazer contas com as datas
  let date =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2); //a string que diz a data atual
  //faço slice(-2) porque slice(-2) da me sempre os ultimos dois characteres da string, e assim se adicionar um zero a mais fico sempre com os ultimos dois characteres e portanto apaga-o

  let time =
    ("0" + today.getHours()).slice(-2) +
    ":" +
    ("0" + today.getMinutes()).slice(-2) +
    ":" +
    ("0" + today.getSeconds()).slice(-2); //a string que diz o tempo atual

  // Para ir buscar o id do user logado
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "secret");
  const id = decoded.userId;

  let divida = new Divida({
    _id: new mongoose.Types.ObjectId(), //crio um novo id para a divida.
    credor: req.body.credor, //Vou buscar o user a que deve, O EMAIL!
    devedor: req.body.devedor, //vou buscar o user a Dever atenção meter um email, O EMAIL!
    quantia: req.body.quantia, //vou buscar a quantia
    descricao: req.body.descricao, //vou buscar a descrição
    paga: false, // se vamos criar uma dívida não faz sentido ela estar inativa. Por isso o seu paga inicial será sempre ativa
    userCriador: id, // User que cria a divida
    date: date + "T" + time, //e a data de hoje ver quanto tempo passou desde a sua criação
    timesemailsent: 0,
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
          credorS: result.name,
          devedorS: result.name,
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
    });
};

// GET REQUEST DE TODAS AS DIVIDAS
exports.get_all_dividas = (req, res, next) => {
  // find() sem argumentos devolve todos as dívidas
  Divida.find()
    .exec()
    .then((dividas) => {
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
            timesemailsent: divida.timesemailsent,
          };
        }),
      };
      res.status(200).json(response);
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.get_all_dividas_user = (req, res, next) => {
  const tokenheader = req.headers.authorization;
  const token = tokenheader.split(" ")[1];
  const decoded = jwt.verify(token, "secret");
  const id = decoded.userId;

  Divida.find({
    devedor: id,
  })
    .exec()
    .then((dividas) => {
      console.log(dividas);
      let TotalRet = dividas.map((divida) => {
        return divida;
      });
      console.log(TotalRet);
      res.status(200).json(TotalRet);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.get_all_dividas_to_me = (req, res, next) => {
  const tokenheader = req.headers.authorization;
  const token = tokenheader.split(" ")[1];
  const decoded = jwt.verify(token, "secret");
  const id = decoded.userId;

  Divida.find({
    credor: id,
  })
    .exec()
    .then((dividas) => {
      console.log("a");
      let TotalRet = dividas.map((divida) => {
        return divida;
      });
      console.log(TotalRet);
      res.status(200).json(TotalRet);
    })
    .catch((err) => {
      console.log(err);
    });
};

// GET DIVIDAS ATIVAS E INATIVAS
exports.dividas_ativas_inativas = (req, res, next) => {
  let url = req.originalUrl.split("/"); // vamos buscar o dividas/ativas ou dividas/inativas e criamos uma lista com cada valor separado por /
  let estado;

  if (url[2] == "ativas?") {
    // se for /dividas/ativas
    estado = false;
  } else if (url[2] == "inativas?") {
    // se for /dividas/inativas
    estado = true;
  } else console.log("algo de errado não está certo");

  const token = localStorage.get("Authorization");
  const decoded = jwt.verify(token, "secret");
  const admin = decoded.admin;

  Divida.find({
    paga: estado,
  }) // vai buscar as dividas com flag especificada no estadp
    .select("quantia devedor credor descricao userCriador paga")
    .exec()
    .then((dividas) => {
      if (!estado) {
        if (admin) {
          return res.json("dividastotaisadmin", {
            dividas: dividas.map((divida) => {
              return divida;
            }),
          });
        } else {
          return res.json("dividastotais", {
            dividas: dividas.map((divida) => {
              return divida;
            }),
          });
        }
      } else {
        return res.json("historico", {
          dividas: dividas.map((divida) => {
            return divida;
          }),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// GET DIVIDAS POR DEPARTAMENTO
exports.dividas_departamento = (req, res, next) => {
  const dep = req.params.departement;
  // find() devolve todos os users do departamento indicado na route
  User.find({
    department: dep,
  })
    .exec()
    .then((users) => {
      // users - array com todos os users do departamento
      console.log(users);
      Divida.find({
        $or: [
          // or para considerar os dois "pedidos"
          {
            credor: {
              $in: users,
            },
          },
          {
            devedor: {
              $in: users,
            },
          },
        ],
      }) // encontra todas as dividas com credores ou devedores que estão no array users
        .exec()
        .then((dividas) => {
          let TotalRet = dividas.map((divida) => {
            return divida;
          });
          console.log(TotalRet);
          res.status(200).json(TotalRet);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.dividas_pordepartamento = (req, res, next) => {
  const dep = ["Ino", "Int", "Tech"];
  let tech = 0;
  let ino = 0;
  let int = 0;
  let tech_pay = 0;
  let ino_pay = 0;
  let int_pay = 0;
  let count = -1;

  dep.forEach((d, i) => {
    User.find({
      department: dep[i],
    })
      .exec()
      .then((users) => {
        // users - array com todos os users do departamento
        Divida.find({
          $or: [
            // or para considerar os dois "pedidos"
            {
              credor: {
                $in: users,
              },
            },
            {
              devedor: {
                $in: users,
              },
            },
          ],
        }) // encontra todas as dividas com credores ou devedores que estão no array users
          .exec()
          .then((dividas) => {
            for (let j = 0; j < dividas.length; j++) {
              if (i === 0) {
                if (!dividas[j].paga) ino += dividas[j].quantia;
                else ino_pay += dividas[j].quantia;
              } else if (i === 1) {
                if (!dividas[j].paga) int += dividas[j].quantia;
                else int_pay += dividas[j].quantia;
              } else if (i === 2) {
                if (!dividas[j].paga) tech += dividas[j].quantia;
                else tech_pay += dividas[j].quantia;
              }
            }

            count++;
            if (count === 2) {
              res.status(200).json({
                ino: ino,
                int: int,
                tech: tech,
                ino_pay: ino_pay,
                int_pay: int_pay,
                tech_pay: tech_pay,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// Opção para dar uma divida como paga
exports.altera_divida = (req, res, next) => {
  console.log("a");
  const id_divida = req.params.dividaID; // id da divida introduizdo no url

  // Isto é feito para se so quisermos mudar campos especificos e não ter de mudar tudo
  const updateOps = {
    paga: true,
  };

  /* JSON - tem de ser desta forma para podermos usar o que temos em cima
  [
    { "propName": "paga", "value": true}
  ]
*/

  // Vamos procurar a divida com o id dado no url, e atualizamos as informações que foram disponibilix«zadas no JSON
  Divida.update(
    {
      _id: id_divida,
    },
    {
      $set: updateOps,
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.get_all_dividasMail = (req, res, next) => {
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
            timesemailsent: divida.timesemailsent,
          };
        }),
      };
      //res.status(200).json(response);
    })
    .catch((err) => {
      // se a promise der erro
      res.status(500).json({
        error: err,
      });
    });
};
