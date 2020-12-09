const express = require("Express");
const router = express.Router();

const JekersController = require("../controllers/jekers")

// GET REQUEST DE TODOS OS JEKERS
router.get("/", JekersController.get_all_jekers);

// POST DE JEKER
router.post("/", JekersController.cria_jeker);

module.exports = router;