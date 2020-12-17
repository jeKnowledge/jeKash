const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users')
const express = require('express');
const flash = require('connect-flash');

const admin_email = "goncalocorreia@jeknowledge.com" 


exports.get_all_users = (req,res,next) =>{
    User.find().select().exec() //array de users
    .then( list_users =>{
        const response ={ // o que vai ser printado no ecrã
            count : list_users.length,
            list: list_users.map( doc =>{
                return {
                    email: doc.email,
                    department: doc.department,
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

    let errors = []
    

    if(!req.body.name || !req.body.lastname || !req.body.email || !req.body.password || !req.body.password2 || !req.body.department){
        errors.push({msg:'Preencha todos os campos'});
    }

    if(req.body.password !== req.body.password2){
        errors.push({msg:'Passwords não coincidem'});
    }

   
    if(req.body.password.lenght >6){
        errors.push({msg:'Tem de ter pelo menos 6 caracteres'});
        console.log('Password 3'+req.body.password);
    }

    if(errors.length >0){
        res.render('signup'),{
            errors:errors,
            name:req.body.name,
            lastname:req.body.lastname,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2,
            department:req.body.department
        }
    } else{
            User.find({ email: req.body.email})
        .exec()
        .then( user =>{ // verifica se o email do novo usuario ja existe na base de dados
            if(user.length >0){   
                errors.push({msg:'Email já existe!'});
                render(res,errors,req.body.name.req.body.lastname,req.body.email,req.body.password,req.body.password2,req.body.department)
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
                                    name:req.body.name,
                                    lastname:req.body.lastname,
                                    email: req.body.email, 
                                    password : hash,
                                    department: req.body.department
                                    });
                            user.save()
                            .then( result =>{
                                console.log(result);
                                req.flash('sucess_msg','Já estás Registado!!');
                                res.redirect('/users/login');
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
    }
    
};

exports.login = (req,res,next)=>{

    let errors = []
    

    if(!req.body.email || !req.body.password ){
        errors.push({msg:'Preencha todos os campos'});
    }

    if(errors.length >0){
        res.render('login'),{
            errors:errors,
            email:req.body.email,
            password:req.body.password
        }
    } else{
            User.findOne({email: req.body.email})
                .exec()
                .then( user =>{
                    if(user.length <1){ // user nao existe, email nao encontrado, login falhado
                        return res.status(401).json({
                            message: 'Email ou Password Invalidos'
                        });
                    }
                    bcrypt.compare(req.body.password,user.password, (err,result) =>{
                    if(err){
                        return res.send(401).json({
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
                                },function(err,token){
                                    console.log(user);
                                    console.log("Token:"+token);
                                }

                            );
                        res.redirect('/home');
                    }  
                    
                    });
                }).catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error:err});
                });
        }
    
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

