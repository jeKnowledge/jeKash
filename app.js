const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressEjsLayout = require("express-ejs-layouts");

const emails = require("./API/timer/SendingEmails")
const dividasRoutes = require("./API/routes/dividas");
const usersRoutes = require("./API/routes/users");
const indexRoutes = require("./API/routes/index");
const jekersRoutes = require("./API/routes/jekers");


app.set("view engine", "ejs");

app.use(expressEjsLayout);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//conectar à minha DB (Testing purposes)
mongoose.connect("mongodb+srv://edu:"+process.env.PASSWORD_DB+"@cluster0.b5mks.mongodb.net/<dbname>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true  });
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
