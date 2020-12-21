//esta file controla as dividas em geral.
const express = require("express");
const router = express.Router();
const checkLogin = require("../middleware/check-login");
const checkServer= require("../middleware/check-server")
const checkUser = require("../middleware/check-user");

const DividasController = require("../controllers/dividas");
//controller das dividas
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in

//post de uma divida da JEK e do Tesoureiro
router.post("/", checkLogin, DividasController.criar_divida_jeK);
router.post("/tesoureiro", checkLogin, DividasController.criar_divida_Tesoureiro);

//* Get Dividas somente para o server Se quiserem fazer um request desta route por favor adicionar ao Postman um header com a chave do server para "simular ser o server"
router.get("/all_dividas_para_o_email",checkServer, DividasController.get_all_dividas)


router.get("/getall", checkLogin, DividasController.get_all_dividas);

// GET DIVIDAS ATIVAS E INATIVAS
router.get(/^\/(in)?ativas/, checkLogin, DividasController.dividas_ativas_inativas)
//router.get("/(in)?ativas", checkLogin, DividasController.dividas_ativas_inativas) - da erro :(

// GET DIVIDAS POR DEPARTAMENTO
router.get("/:departement", checkLogin, DividasController.dividas_departamento);


// Opção para dar uma divida como paga
router.patch("/:dividaID", checkLogin, checkUser, DividasController.altera_divida)


module.exports = router;
