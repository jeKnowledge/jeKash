//esta file controla as dividas em geral.
const express = require("express");

const router = express.Router();
const checkLogin = require("../middleware/check-login");
const checkServer = require("../middleware/check-server");
const checkUser = require("../middleware/check-user");
const checkAdmin = require("../middleware/check-admin");

const DividasController = require("../controllers/Dividas");

//controller das dividas
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in

//post de uma divida da JEK e do Tesoureiro
router.post("/", checkLogin, DividasController.criar_divida_jeK);


//* Get Dividas somente para o server Se quiserem fazer um request desta route por favor adicionar ao Postman um header com a chave do server para "simular ser o server"
router.get(
  "/all_dividas_para_o_email",
  checkServer,
  DividasController.get_all_dividasMail
);

// Opção para dar uma divida como paga

// GET DIVIDAS POR USER
router.get("/usertoo", checkLogin, DividasController.get_all_dividas_user);

router.get("/toouser", checkLogin, DividasController.get_all_dividas_to_me);

router.get("/alldep", checkLogin, DividasController.dividas_pordepartamento);

// GET DIVIDAS POR DEPARTAMENTO
//! Depois voltar a adicionar checkLogin. Tirei para testar, quando voltarmos a ter algo que consiga passar a header do login voltar a meter.
router.get("/:departement", checkLogin, DividasController.dividas_departamento);

router.post("/:dividaID", checkLogin, DividasController.altera_divida);

module.exports = router;
