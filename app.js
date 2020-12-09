const express = require("Express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")

// ir buscar o ficheiro dividas.js
const dividasRoutes = require("./api/routes/dividas");
const jekersRoutes = require("./api/routes/jekers");

// Conexão a database do Mongo Atlas (user - jek, pass - jek7890)           Segundo argumento são flags para evitar warnings
mongoose.connect("mongodb+srv://jeknowledge:" + process.env.PASSWORD_DB + "@jek-project.25zmf.mongodb.net/<dbname>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true  });
// Para nos livrarmos de um warning
mongoose.Promise = global.Promise

// MIDDLEWARES

// conexao com a pasta do html
app.use(express.static("visual"))

// emite mensagens no terminal quando sao feitos requests
app.use(morgan("dev"));

// handle do cors no browser
app.use(cors());

// Extrai os metodos (urlencoded e json) e torna-o mais bonito de ler para nos
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handling CORS - mecanismo de segurança do browser, por isso usamos os headers. No postman isto nao da para testar
// ESTA COMENTADO PORQUE NAO SEI SE É PARA IMPLEMENTAR, QUALQUER COISA É SÓ DESCOMENTAR E AJUSTAR
/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});
*/

// ROUTES
// Todos os url que começarem por /dividas vao ser enviados para o dividas.js onde o router vai receber
app.use("/dividas", dividasRoutes);
app.use("/jekers", jekersRoutes);

// HANDLING ERRORS
// 404 - Para erros not found
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    // envia este erro em vez do original
    next(error);
})

// 500 - para erros internos
app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;