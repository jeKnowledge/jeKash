const mongoose = require("mongoose");
const Divida = require("../models/divida");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
//! CRIAR NA DATABASE UMA CONTA JEK DEFAULT PARA DAR AS DIVIDAS CRIADAS POR UM JEKER

//controler para criar uma divida de um User daí o nome "criar_divida_jeK"

function metezeros(pal) {
  if (pal===0){
    return "00"
  }
  return pal;
}

exports.criar_divida_jeK = (req, res, next) => {
  let h,m,s;
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

  h = metezeros(today.getHours())
  m = metezeros(today.getMinutes())
  s = metezeros(today.getSeconds())

  let time =
    h + ":" + m + ":" +s; //a string que diz o tempo atual

  let devedores = req.body.divida.devedor.split(",");

  const tokenheader = req.headers.authorization;
  const token = tokenheader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET_SV_KEY);
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

exports.getAllDividas = (req, res, next) => {
  Divida.find()
    .select()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

exports.get_all_dividas_user = (req, res, next) => {
  const tokenheader = req.headers.authorization;
  const token = tokenheader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET_SV_KEY);
  const id = decoded.userId;

  Divida.find({
    devedor: id,
  })
    .exec()
    .then((dividas) => {
      let TotalRet = dividas.map((divida) => {
        return divida;
      });
      res.status(200).json(TotalRet);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_all_dividas_to_me = (req, res, next) => {
  const tokenheader = req.headers.authorization;
  const token = tokenheader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET_SV_KEY);
  const id = decoded.userId;

  Divida.find({
    credor: id,
  })
    .exec()
    .then((dividas) => {
      let TotalRet = dividas.map((divida) => {
        return divida;
      });
      res.status(200).json(TotalRet);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
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
          res.status(200).json(TotalRet);
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
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
            res.status(500).json({
              error: err,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};

// Opção para dar uma divida como paga
exports.altera_divida = (req, res, next) => {
  const id_divida = req.params.dividaID; // id da divida introduizdo no url

  // Isto é feito para se so quisermos mudar campos especificos e não ter de mudar tudo
  const updateOps = {
    paga: true,
  };

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
      res.status(500).json({
        error: err,
      });
    });
};

