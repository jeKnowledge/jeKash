const bodyParser = require("body-parser");
const express = require("express");
const morgan =  require("morgan");
const mongoose = require("mongoose");
const emails = require("./api/timer/SendingEmails")
const server = require("http").createServer();
const app = express();

//defenir a variaveis paraas routes
const dividaRoutes = require("./api/routes/dividas");



app.use(morgan("dev")); //dev bc its developer
app.use('/uploads',express.static("uploads"))
app.use(bodyParser.json());

//conectar à minha DB (Testing purposes)
mongoose.connect("mongodb+srv://jeknowledge:" + process.env.PASSWORD_DB + "@jek-project.25zmf.mongodb.net/<dbname>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.Promise = global.Promise

//browser headers stuff, allowting to send headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});



//MyRoutes
app.use("/dividas",dividaRoutes);


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
