const mongoose = require("mongoose");
const { OAuth2Client } = require('google-auth-library');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const admin_email = "rita.matos@jeknowledge.com";

const CLIENT_ID = process.env.googleAuthSecret;
exports.googleLogin = (req, res, next) => {
  const client = new OAuth2Client(CLIENT_ID);
  const tokenId = req.body.token;
  console.log("tokenID:", tokenId);
  if (tokenId) {

    // validate token using google login
    client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }).then((ticket) => {
      console.log("ticket: ", ticket);
      const payload = ticket.getPayload();
      const userid = payload['sub'];

      // check if it expired also
      const exp = payload['exp'];
      const now = Date.now() / 1000; 
      if (now > exp) {
        console.log("token expired");
        return res.status(400).json({
          error: "Something went wrong... Token expired.",
        });
      }

      if (userid) {
        const { email_verified, name, email } = payload;
        console.log("email_verified: ", email_verified);
        console.log("name: ", name);
        console.log("email: ", email);

        if (email_verified) {
          User.findOne({
            email: email,
          })
          .select()
          .exec()
          .then((user) => {
            console.log("user: ", user);
              if (user) {
                jwt.sign(
                  //payload,privateKey, [options,callback]
                  {
                    email: user.email,
                    userNamefirst: user.name,
                    userNamelast: user.lastname,
                    userId: user._id,
                    admin: user.admin,
                  },
                  process.env.SECRET_SV_KEY,
                  {
                    expiresIn: "1h",
                  },
                  function (err, token, response) {
                    return res.status(200).json({
                      userData: user.name + " " + user.lastname,
                      Authorization: token,
                    });
                  }
                );
              } else {
                return res.status(400).json({
                  error: "User not found...",
                });
              }
          }).catch((err) => {
            console.log(err);
            return res.status(400).json({
              error: "Something went wrong...",
            });
          });
        } else {
          return res.status(400).json({
            error: "Something went wrong... Email not verified.",
          });
        }
      }
    }).catch((err) => {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong...",
      });
    });
  }
};


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
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
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

          jwt.sign(
            //payload,privateKey, [options,callback]
            {
              email: user.email,
              userNamefirst: user.name,
              userNamelast: user.lastname,
              userId: user._id,
              admin: user.admin,
            },
            process.env.SECRET_SV_KEY,
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
          return res.status(401).json("error");
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
