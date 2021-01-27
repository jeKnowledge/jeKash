const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressEjsLayout = require("express-ejs-layouts");
const connectFlash = require('connect-flash');
const session = require('express-session');
const path = require('path');

const emails = require("./API/timer/SendingEmails"); //! apesar de não estar a ser usado, afirmar aqui para correr
const dividasRoutes = require("./API/routes/dividas");
const usersRoutes = require("./API/routes/users");
const indexRoutes = require("./API/routes/index");
const {
  Authenticator
} = require("passport");

mongoose.connect(
  "mongodb+srv://exp-node:givemmb@givemmb.aqww5.mongodb.net/exp-node?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// ola
mongoose.Promise = global.Promise;



app.set("view engine", "ejs");
app.set("views", "./views")

app.use(cors());
app.use(cookieParser('secret'));

app.use(expressEjsLayout);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.json());


app.use(express.static(path.join(__dirname, '/public')));
app.use('public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static("public"));



app.use(express.urlencoded({
  extended: false
}));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//use flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// app.use((req,res,next) =>{
//   res.header("Acess-Control-Allow-Origin","*");
//   res.header("Acess-Control-Allow-Headers","Origin, X-Requested-With","Content-Type","Authentization");
// });




app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/dividas", dividasRoutes);

// ERROS
//req = o que recebemos, res = resposta que damos
app.use((req, res, next) => {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500; //se nao existir o status do erro, envia 500

  //se exitir erro (por exemplo 404 se nao exitir) envia isto:
  res.status(status).json({
    message: 'Error not found! Status: ' + status
  });
});

module.exports = app;