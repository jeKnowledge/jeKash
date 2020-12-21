//esta file controla as dividas em geral.
const express = require("express");

const router = express.Router();
const checkLogin = require("../middleware/check-login");
const checkUser = require("../middleware/check-user");
const checkAdmin = require("../middleware/check-admin");

const DividasController = require("../controllers/Dividas");
const { response } = require("express");
//controller das dividas
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in

router.get('/create',(req,res,next)=>{
    res.render('dividas');
    
})




//post de uma divida da JEK e do Tesoureiro
router.post("/",checkLogin, DividasController.criar_divida_jeK);
router.post("/tesoureiro", checkAdmin, DividasController.criar_divida_Tesoureiro);

router.get("/getall", checkLogin, DividasController.get_all_dividas);

// GET DIVIDAS ATIVAS E INATIVAS
router.get("/i?n?ativas", checkLogin, DividasController.dividas_ativas_inativas);
//router.get("/(in)?ativas", checkLogin, DividasController.dividas_ativas_inativas) - da erro :(

// GET DIVIDAS POR DEPARTAMENTO
router.get("/:departement", checkLogin, DividasController.dividas_departamento);


// GET DIVIDAS POR USER
router.get("/user",checkLogin,DividasController.get_all_dividas_user);


// Opção para dar uma divida como paga
router.patch("/:dividaID", checkLogin, checkUser, DividasController.altera_divida);




module.exports = router;
