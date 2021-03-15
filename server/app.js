const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const emails = require("./API/timer/SendingEmails");
const dividasRoutes = require("./API/routes/dividas");
const usersRoutes = require("./API/routes/users");

mongoose.connect(
  "mongodb+srv://exp-node:givemmb@givemmb.aqww5.mongodb.net/exp-node?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// ola
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors());
app.use(cookieParser("secret"));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));
app.use(
  "public/stylesheets",
  express.static(path.join(__dirname, "public/stylesheets"))
);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "./build/")));

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

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
    message: "Error not found! Status: " + status,
  });
});

module.exports = app;
