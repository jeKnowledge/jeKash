//esta file controla as dividas em geral.
const express = require("express");

const router = express.Router();
const checkLogin = require("../middleware/check-login");
const checkServer= require("../middleware/check-server")
const checkUser = require("../middleware/check-user");
const checkAdmin = require("../middleware/check-admin");

const DividasController = require("../controllers/Dividas");

//controller das dividas
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in

router.get('/create',(req,res,next)=>{
    res.render('dividas');
    
})



//post de uma divida da JEK e do Tesoureiro
router.post("/",checkLogin, DividasController.criar_divida_jeK);
router.post("/tesoureiro", checkAdmin, DividasController.criar_divida_Tesoureiro);

//* Get Dividas somente para o server Se quiserem fazer um request desta route por favor adicionar ao Postman um header com a chave do server para "simular ser o server"
router.get("/all_dividas_para_o_email",checkServer, DividasController.get_all_dividasMail);


router.get("/getall", checkLogin, DividasController.get_all_dividas);

// GET DIVIDAS ATIVAS E INATIVAS
router.get(/^\/(in)?ativas/, checkLogin, DividasController.dividas_ativas_inativas);

// Opção para dar uma divida como paga

// GET DIVIDAS POR USER
router.get("/user",checkLogin,DividasController.get_all_dividas_user);


// GET DIVIDAS POR DEPARTAMENTO
router.get("/:departement", checkLogin, DividasController.dividas_departamento);

router.post("/:dividaID", checkLogin,DividasController.altera_divida);



module.exports = router;
