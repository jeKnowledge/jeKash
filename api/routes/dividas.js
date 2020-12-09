const express = require("Express");
const router = express.Router();

const DividasController = require("../controllers/dividas")

//----------------- HANDLE DE TODAS AS ROTAS DAS DIVIDAS

// chamamos os controllers de dividas.js presente na pasta controllers

// GET REQUEST DE TODAS AS DIVIDAS
router.get("/", DividasController.get_all_dividas);

// POST para ajudar a testar
router.post("/", DividasController.create_divida);

// ---------------------------------------------GET DIVIDAS POR DEPARTAMENTO

// INTERN
router.get("/intern", DividasController.dividas_intern);

// TECH
router.get("/tech", DividasController.dividas_tech);

// INNOVATION
router.get("/innovation",  DividasController.dividas_innovation);


module.exports = router;