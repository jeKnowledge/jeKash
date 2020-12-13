const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users')
const express = require('express');

const admin_email = "goncalocorreia@jeknowledge.com" 


exports.get_all_users = (req,res,next) =>{

    User.find().select().exec() //array de users
    .then( list_users =>{
        const response ={ // o que vai ser printado no ecrã
            count : list_users.length,
            list: list_users.map( doc =>{
                return {
                    email: doc.email,
                    departament: doc.departament,
                    admin: doc.admin,
                    _id:doc._id
                }
            })
        };
        res.status(200).json(response)
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
};

exports.signup =  (req,res,next) =>{ // criar um novo user no servidor

    User.find({ email: req.body.email})
    .exec()
    .then( user =>{ // verifica se o email do novo usuario ja existe na base de dados
        if(user.length >0){   
            return res.status(409).json({
                message: "Mail Exists"
            });
        } else { // se não cria um novo usario
                    bcrypt.hash(req.body.password,10,(err,hash) =>{ // encripta a password
                    if(err){
                        return res.status(500).json({
                            error:err
                        });
                    }
                    else{
                        const user = new User({ //cria um usario com email e password (encriptada)
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email, 
                                password : hash,
                                departament: req.body.departament
                                });
                        user.save()
                        .then( result =>{
                            console.log(result);
                            return res.status(201).json({
                                message: "User Created"
                            });
                        })
                        .catch( err =>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        });
                    }
            
            });
        }

    }).catch( err =>{
             console.log(err);
             res.status(500).json({error:err});
    });
};

exports.login = (req,res,next)=>{
    res.send("login");
    console.log("a");
    User.findOne({email: req.body.email})
    .exec()
    .then( user =>{
        console.log("a");
        if(user.length <1){ // user nao existe, email nao encontrado, login falhado
            return res.status(401).json({
                message: 'Email ou Password Invalidos'
            });
        }
        bcrypt.compare(req.body.password,user.password, (err,result) =>{
          if(err){
              return res.status(401).json({
                message: 'Erro!'
              });
          }
          if(result){
              
              if (user.email === admin_email){
                  user.admin = true; //se o login for feito pelo admin, admin do user passa para true
              }

              const token = jwt.sign( //payload,privateKey, [options,callback]
                  {
                      email: user.email,
                      userId: user._id,
                      admin: user.admin
                  },
                  "secret",
                  {
                      expiresIn: "1h"
                  }

                  );
                  return res.status(200).json({
                      message: 'Login Valido',
                      admin: user.admin,
                      token: token
                  });
          }  
          return res.status(401).json({
                message: 'Email ou Password Invalidos'
              });
        });
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err});
    });
}; 

exports.signout = (req,res,next) =>{
     const user_del = User.findOne({ email: req.body.email}) // apagar o user pelo email
        
        User.remove(user_del).exec() 
        .then( result =>{
             res.status(200).json({
                message: "User Deleted"
            });
        })
         .catch( err =>{
            console.log(err);
            res.status(500).json({error:err});
        });
        
};
