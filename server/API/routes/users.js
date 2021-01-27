const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userControllers = require('../controllers/users');
const User = require('../models/users');
const messages = require('../middleware/connectFlash');
const checkServer = require("../middleware/check-server");

router.get('/login', (req, res, next) => {
    res.render('login');

})

router.get('/signup', (req, res, next) => {
    res.render('signup');
})


router.get('/logout', (req, res, next) => {
    //const token = localStorage.get('Authorization');
    //localStorage.removeItem(token);
    req.session.destroy();
    res.redirect('/');

})

//* O server vai precisar desta para conseguir o email de um user!
router.get("/getall", checkServer, userControllers.get_all_users);


router.post("/signup", messages, userControllers.signup);

router.post("/login", messages, userControllers.login);

router.delete("/signout", userControllers.signout);


module.exports = router;