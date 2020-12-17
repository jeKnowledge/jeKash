const express = require('express');
const router = express.Router();


//login page

router.get('/',(req,res)=>{
    res.render('login');
})


//register page
router.get('/signup',(req,res)=>{
    res.render('signup');
})
router.get('/home',(req,res)=>{
    res.render('home');
})

module.exports = router;

