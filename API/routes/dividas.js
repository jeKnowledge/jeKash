//esta file controla as dividas em geral.
const express = require("express");

const router = express.Router();
const checkLogin = require("../middleware/check-login");
const checkUser = require("../middleware/check-user");
const checkAdmin = require("../middleware/check-admin");

const DividasController = require("../controllers/Dividas");
//controller das dividas
//const checkAuth = require("../middleware/check-auth")//a checkAuth é a middleware do log-in



router.get('/',(req,res,next)=>{
    res.render('dividas');
})

router.get('/dividas/getall',(req,res,next)=>{
    res.render('dividastotais',{dividas:dividas});
})

router.get('/dividas/:department',(req,res,next)=>{
    res.render('dividasDepartment',{dividas_dep:dividas_dep});
})


router.get('/dividas/:dividaId',(req,res,next)=>{
    res.render('eliminadivida');
})

router.get('/dividas/users',(req,res,next)=>{
    res.render('dividasUser');
})




//post de uma divida da JEK e do Tesoureiro
router.post("/",checkLogin, DividasController.criar_divida_jeK);
router.post("/tesoureiro", checkAdmin, DividasController.criar_divida_Tesoureiro);

router.get("/getall", checkLogin, DividasController.get_all_dividas);

// GET DIVIDAS ATIVAS E INATIVAS
router.get("/i?n?ativas", checkLogin, DividasController.dividas_ativas_inativas);
//router.get("/(in)?ativas", checkLogin, DividasController.dividas_ativas_inativas) - da erro :(

// GET DIVIDAS POR DEPARTAMENTO
router.get("/:departement", checkLogin, DividasController.dividas_departamento);


// GET DIVIDAS POR USER
router.get("/users",checkLogin,DividasController.get_all_dividas_user);


// Opção para dar uma divida como paga
router.patch("/:dividaId", checkLogin, checkUser, DividasController.altera_divida);





module.exports = router;
