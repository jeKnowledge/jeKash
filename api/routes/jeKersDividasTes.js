const express = require("express");
const router = express.Router();
const DividasControllerTES = require("../controllers/DividasTes") //controller das dividas    

//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in


//router.post('/',checkAuth,DividasControllerTES.criar_divida_Tesoureiro); //route do controller divida criada pelo Tesoureiro
router.post('/',DividasControllerTES.criar_divida_Tesoureiro);

module.exports=router;