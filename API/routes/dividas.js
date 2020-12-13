//esta file controla as dividas em geral.
const express = require("express");
const router = express.Router();

const DividasController = require("../controllers/Dividas");
//controller das dividas
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in

//post de uma divida da JEK e do Tesoureiro
router.post("/", DividasController.criar_divida_jeK);
router.post("/", DividasController.criar_divida_Tesoureiro);

// GET REQUEST DE TODAS AS DIVIDAS para ajudar a testar
router.get("/", DividasController.get_all_dividas);

module.exports = router;
