const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users')
const localStorage = require('local-storage');

const admin_email = "goncalocorreia@jeknowledge.com"


exports.get_all_users = (req, res, next) => {
    User.find().select().exec() //array de users
        .then(list_users => {
            const response = { // o que vai ser printado no ecrã
                count: list_users.length,
                list: list_users.map(doc => {
                    return {
                        email: doc.email,
                        department: doc.department,
                        admin: doc.admin,
                        _id: doc._id
                    }
                })
            };
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.signup = (req, res, next) => { // criar um novo user no servidor
    let errors = [];
    User.find({
            email: req.body.user.email
        })
        .exec()
        .then(user => { // verifica se o email do novo usuario ja existe na base de dados
            if (user.length > 0) {
                res.status(409).json({
                    msg: "Already Registed!"
                })
                
            } else { // se não cria um novo usario
                bcrypt.hash(req.body.user.password, 10, (err, hash) => { // encripta a password
                    if (err) {
                        errors.push({
                            msg: 'Erro'
                        })
                        console.log(err)
                    } else {
                        const user = new User({ //cria um usario com email e password (encriptada)
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.user.name,
                            lastname: req.body.user.lastname,
                            email: req.body.user.email,
                            password: hash,
                            department: req.body.user.department
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(200).json(result);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }

                });
            }
        }).catch(err => {
            console.log(err)
        });

};



exports.login = (req, res, next) => {

    let errors = []

    if (!req.body.user.email || !req.body.user.password) {
        errors.push({
            msg: 'Preencha todos os campos'
        });
    }
    User.findOne({
            email: req.body.user.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) { // user nao existe, email nao encontrado, login falhado
                errors.push("error", "Email nao existe");
            }
            bcrypt.compare(req.body.user.password, user.password, (err, result) => {
                if (err) {
                    errors.push({
                        msg: 'email already registered'
                    });
                    //! fazer exceçãio de erro.
                }
                if (result) {

                    if (user.email === admin_email) {
                        user.admin = true; //se o login for feito pelo admin, admin do user passa para true
                    }

                    const response = jwt.sign( //payload,privateKey, [options,callback]
                        {
                            email: user.email,
                            userId: user._id,
                            admin: user.admin
                        },
                        "secret", {
                            expiresIn: "1h"
                        },
                        function (err, token) {
                            //? testing purposes callback.
                            //? console.log("Token:" + token);

                            //* a resposta de um user validado vai ser um token que e guardado na storage no react client sided.
                            res.status(200).json({Authorization: token});
                        }
                    );

                } else {
                    errors.push({
                        msg: 'Password Incorreta'
                    });
                    res.status(401).json(user);
                }

            });
        }).catch(err => {
            req.flash("error", "Erro")
        });


};

exports.signout = (req, res, next) => {
    const user_del = User.findOne({
        email: req.body.email
    }) // apagar o user pelo email

    User.remove(user_del).exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};