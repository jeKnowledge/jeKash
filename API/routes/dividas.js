const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAdmin = require('../middleware/check-admin');
const checkLogin = require('../middleware/check-login');
const dividastControllers = require('../controllers/dividas');

router.get("/",checkLogin,dividastControllers.get_all_dividas);

router.post("/",checkAdmin,checkLogin,dividastControllers.criar_divida);



module.exports = router;