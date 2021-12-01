const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const admin_email = "sergio.lopes@jeknowledge.com";


exports.signup = (req, res, next) => {
  // criar um novo user no servidor
  let errors = [];
  User.find({
    email: req.body.user.email,
  })
    .exec()
    .then((user) => {
      // verifica se o email do novo usuario ja existe na base de dados
      if (user.length > 0) {
        console.log("Email ja registado...");
        errors.push({
          msg: "Email already registered",
        });
      } else {
        // se não cria um novo usario
        bcrypt.hash(req.body.user.password, 10, (err, hash) => {
          // encripta a password
          if (err) {
            errors.push({
              msg: "Erro",
            });
            console.log(err);
          } else {
            const user = new User({
              //cria um usario com email e password (encriptada)
              _id: new mongoose.Types.ObjectId(),
              name: req.body.user.name,
              lastname: req.body.user.lastname,
              email: req.body.user.email,
              password: hash,
              department: req.body.user.department,
            });
            user
              .save()
              .then((result) => {
                res.status(200).json(result);
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.login = (req, res, next) => {
  let errors = [];

  if (!req.body.user.email || !req.body.user.password) {
    errors.push({
      msg: "Preencha todos os campos",
    });
  }
  User.findOne({
    email: req.body.user.email,
  })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        // user nao existe, email nao encontrado, login falhado
        errors.push("error", "Email nao existe");
      }
      bcrypt.compare(req.body.user.password, user.password, (err, result) => {
        if (err) {
          console.log("Email ja registado...");
          errors.push({
            msg: "email already registered",
          });
          //! fazer exceçãio de erro.
        }
        if (result) {
          if (user.email === admin_email) {
            user.admin = true; //se o login for feito pelo admin, admin do user passa para true
          }

          const response = jwt.sign(
            //payload,privateKey, [options,callback]
            {
              email: user.email,
              userNamefirst: user.name,
              userNamelast: user.lastname,
              userId: user._id,
              admin: user.admin,
            },
            "secret",
            {
              expiresIn: "1h",
            },
            function (err, token, response) {
              res.status(200).json({
                userData: user.name + " " + user.lastname,
                Authorization: token,
              });
            }
          );
        } else {
          res.status(401).json("error");
        }
      });
    })
    .catch((err) => {
      res.status(401).json({ err: "error" });
    });
};

exports.signout = (req, res, next) => {
  const user_del = User.findOne({
    email: req.body.email,
  }); // apagar o user pelo email

  User.remove(user_del)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
