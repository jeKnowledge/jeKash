const jwt = require('jsonwebtoken');
const User = require('../models/users');


module.exports = (req,res,next) =>{

    try {
    
    const token = localStorage.get('Authorization'); 
    console.log(token); 
    const decoded = jwt.verify(token,"secret");
    req.userData = decoded;
    const admin = decoded.admin;
    if(admin == true){
        next();        
    } else {
        return res.status(401).json({
            message: 'Not Permitted'
        });
    }

    }
    catch (error){
        return res.status(401).json({
            message: 'Authorizacion Failed'
        });
    } 
};