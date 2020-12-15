const jwt = require('jsonwebtoken');
const User = require('../models/users');


module.exports = (req,res,next) =>{

    try {
    
    const token = req.headers.authorization.split(" ")[1]; 
    const decoded = jwt.verify(token,"secret");
    req.userData = decoded;
    const id = userData._id;    
    return id
    }
    catch (error){
        return res.status(401).json({
            message: 'Authorizacion Failed'
        });
    } 
};