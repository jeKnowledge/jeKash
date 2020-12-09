const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Divida = require('../models/dividas');

exports.isAdmin = (req,res,next) =>{

}
exports.get_all_dividas = (req,res,next) =>{
    res.status(200).json({
  message: 'Lista de Dividas'
    });
};

exports.criar_divida = (req,res,next) =>{
     res.status(200).json({
  message: 'Divida Criada'
    });
};