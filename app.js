const bodyParser = require("body-parser");
const express = require("express");
const morgan =  require("morgan");
const mongoose = require("mongoose");
const server = require("http").createServer();

const app = express();

app.use(morgan("dev")); //dev bc its developer
app.use('/uploads',express.static("uploads"))
app.use(bodyParser.json());


//defenir a routeta
const dividaRoutesTes = require("./routes/jeKersDividasTes");
const dividaRoutesJek = require("./routes/jeKersDividasJek");


//MyRoutes
app.use("/dividasTes",dividaRoutesTes);
app.use("/dividasJek",dividaRoutesJek);

// ERROS
//req = o que recebemos, res = resposta que damos
app.use((req, res,next)=>{
    const err = new Error("Not found :(((");
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