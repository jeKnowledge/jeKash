//esta file controla as dividas em geral.
const express = require("express");
const router = express.Router();
const checkLogin = require("../middleware/check-login");

const DividasController = require("../controllers/Dividas");
//controller das dividas
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in

//post de uma divida da JEK e do Tesoureiro
router.post("/", DividasController.criar_divida_jeK);
router.post("/tesoureiro", DividasController.criar_divida_Tesoureiro);

// GET REQUEST DE TODAS AS DIVIDAS para ajudar a testar
router.get("/", checkLogin,  DividasController.get_all_dividas);

// ---------------------------------------------GET DIVIDAS POR DEPARTAMENTO

// INTERN
router.get("/intern", checkLogin, DividasController.dividas_intern);

// TECH
router.get("/tech", checkLogin, DividasController.dividas_tech);

// INNOVATION
router.get("/innovation",  checkLogin, DividasController.dividas_innovation);

module.exports = router;
