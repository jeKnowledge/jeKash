const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users');
const User = require('../models/users');






router.get("/", userControllers.get_all_users);

router.post("/signup",userControllers.signup);

router.post("/login",userControllers.login);

router.delete("/signout",userControllers.signout);


module.exports = router;