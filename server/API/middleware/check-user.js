const jwt = require("jsonwebtoken");
const Divida = require("../models/divida");

// Vai ser usado para verificar se o user que criou a divida, é o que está a atualizá-la
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_SV_KEY);
    req.userData = decoded;
    const idUserLogado = decoded.userId;
    const id_divida = req.params.dividaID;
    Divida.find({
      _id: id_divida,
    })
      .exec()
      .then((result) => {
        // esta com index zero porque o json enviado no patch é enviado dentro de uma lista (?)
        if (idUserLogado == result[0].userCriador) {
          next();
        } else {
          return res.status(401).json({
            message: "Not Permitted",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          errors: err,
        });
      });
  } catch (error) {
    return res.status(401).json({
      message: "Authorizacion Failed",
    });
  }
};
