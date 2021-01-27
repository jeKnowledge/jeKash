const express = require('express');
const router = express.Router();


//login page

<<<<<<< Updated upstream:API/routes/index.js
router.get('/',(req,res)=>{
    res.render('welcomelogin');
})


router.get('/home',(req,res)=>{
=======
router.get('/', (req, res) => {
    res.render('welcome');
})


//register page
router.get('/signup', (req, res) => {
    res.render('signup');
})
router.get('/home', (req, res) => {
>>>>>>> Stashed changes:server/API/routes/index.js
    res.render('home');
})

module.exports = router;