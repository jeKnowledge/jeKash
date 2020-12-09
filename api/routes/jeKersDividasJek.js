const express = require("express");
const router = express.Router();
const DividasControllerJek = require("../controllers/DividasJek") //controller das dividas    
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in


//router.post('/',checkAuth,DividasControllerJek.criar_divida_jeK); //route do controller divida criada por um Jeker
router.post('/',DividasControllerJek.criar_divida_jeK);

//penso que isto e tudo.
module.exports=router;