const express = require('express');
const router = express.Router();


//login page

router.get('/',(req,res)=>{
    res.render('welcomelogin');
})


router.get('/home',(req,res)=>{
    res.render('home');
})

module.exports = router;

