const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users')
const localStorage = require('local-storage');

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

    if(errors.length){
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
                errors.push({msg: 'Email already registered'});
                render(res,errors,user.name,user.lastname,user.email,user.password,user.password2,user.department);
                
            } else { // se não cria um novo usario
                        bcrypt.hash(req.body.password,10,(err,hash) =>{ // encripta a password
                        if(err){
                            errors.push({msg: 'Erro'})
                            res.redirect('signup');
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
                                req.flash('success_msg','You have now registered!')
                                res.redirect('login');
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
                req.flash("errors",err);
                res.redirect("signup");
        });
    }
};



exports.login = (req,res,next)=>{

    let errors = []
    

    if(!req.body.email || !req.body.password ){
        errors.push({msg:'Preencha todos os campos'});
    }

    if(errors.length >0){
        res.render('/'),{
            errors:errors,
            email:req.body.email,
            password:req.body.password
        }
    } else{
            User.findOne({email: req.body.email})
                .exec()
                .then( user =>{
                    if(user.length <1){ // user nao existe, email nao encontrado, login falhado
                        errors.push("error", "Email nao existe");
                        res.render('/',{errors:errors,email:req.body.email,
                            password:req.body.password});
                    }
                    bcrypt.compare(req.body.password,user.password, (err,result) =>{
                    if(err){
                        errors.push({msg: 'email already registered'});
                        res.render('login',{errors:errors,email:req.body.email,
                            password:req.body.password});
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
                                    localStorage('Authorization',token);
                                    console.log(user);
                                    console.log("Token:"+token);
                                }
                            );
                        res.redirect('/home');
                    }
                    else{
                        errors.push({msg: 'Password Incorreta'});
                        res.redirect('/');
                    }  
                    
                    });
                }).catch(err =>{req.flash("error", "Erro")});
        
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

