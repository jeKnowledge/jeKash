const jwt = require('jsonwebtoken');
const localStorage = require('local-storage');

module.exports = (req,res,next) =>{
    
    try {
    const token = localStorage.get('Authorization'); 
    //console.log(token);
    const decoded = jwt.verify(token,"secret");
    req.userData = decoded;
    next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Login Failed'
        });
    } 
};