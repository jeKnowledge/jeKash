const jwt = require('jsonwebtoken');
const localStorage = require('local-storage');

module.exports = (req,res,next) =>{
    
    try {
        const token = localStorage.getItem('Authorization');
        //console.log(token);
        const decoded = jwt.verify(token,"secret");
        req.userData = decoded;
        next();
    }
    catch (error) {
        req.flash("error", "You must be logged in to do that.");
    } 
};