const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressEjsLayout = require("express-ejs-layouts");
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const fileUpload = require('express-fileupload');

const emails = require("./API/timer/SendingEmails")
const dividasRoutes = require("./API/routes/dividas");
const usersRoutes = require("./API/routes/users");
const indexRoutes = require("./API/routes/index");
const jekersRoutes = require("./API/routes/jekers");


app.set("view engine", "ejs");
app.set("views","./views")

app.use(expressEjsLayout);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname,'/public')));
app.use('public/stylesheets',express.static(path.join(__dirname,'public/stylesheets')));
app.use(express.static("public"));



app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}));

app.use(flash());
app.use((req,res,next)=>{ //este codigo permite flash messages na app
  res.locals.sucess_msg = req.flash('sucess_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})



app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/dividas", dividasRoutes);
app.use("/jekers", jekersRoutes);


// ERROS
//req = o que recebemos, res = resposta que damos
app.use((req, res,next)=>{
    const err = new Error("Not found.");
    err.status = 404;
    next(err);
});

app.use((err,req,res,next)=>{
    const status = err.status || 500; //se nao existir o status do erro, envia 500

    //se exitir erro (por exemplo 404 se nao exitir) envia isto:
    res.status(status).json({
        message: 'Error not found! Status: ' + status
    });
});



//Server Turn On
const port = process.env.PORT|| 5000;
//ouve neste ip esta porta
app.listen(port,()=>{
    //quando corre a porta com sucesso faz esta funcao
    console.log("Server Live At: ",port)
})

module.exports = app;
