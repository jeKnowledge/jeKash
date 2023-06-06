const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userControllers = require('../controllers/users');
const User = require('../models/users');
const checkServer = require("../middleware/check-server");



router.get('/logout', (req, res, next) => {
    //const token = localStorage.get('Authorization');
    //localStorage.removeItem(token);
    req.session.destroy();
    window.location.reload();

})

router.post("/signup", userControllers.signup);

router.post("/login", userControllers.login);

router.delete("/signout", userControllers.signout);

router.post("/googleLogin", userControllers.googleLogin);


module.exports = router;