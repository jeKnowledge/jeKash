const flash = require('connect-flash');


module.exports = (req,res,next) =>{
    res.locals.flashMessages = req.flash();
    next();
};
  
  