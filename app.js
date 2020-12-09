const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const dividasRoutes = require('./API/routes/dividas');
const usersRoutes = require('./API/routes/users');

mongoose.connect("mongodb+srv://exp-node:givemmb@givemmb.aqww5.mongodb.net/exp-node?retryWrites=true&w=majority",{
   useNewUrlParser: true,
   useUnifiedTopology: true 
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/dividas',dividasRoutes);
app.use('/user',usersRoutes);


app.use((req,res,next) =>{
    const error = new Error('Id not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) =>{
    res.status(error.status || 500);
        res.json({
            error:{
                message: error.message
            }
        });
});


module.exports=app;