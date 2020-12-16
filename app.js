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

const dividasRoutes = require("./API/routes/dividas");
const usersRoutes = require("./API/routes/users");
const indexRoutes = require("./API/routes/index");
const jekersRoutes = require("./API/routes/jekers");

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

app.use((req, res, next) => {
  const error = new Error("Page not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
