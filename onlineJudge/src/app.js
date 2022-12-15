var express = require('express');
var bodyparser = require('body-parser');
// var conf = require('./conf.js');
var app = express();
var fileupload = require("./routes/fileupload");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const url = "/OnlineJudge/"

app.use(express.static('view/'))
app.use(fileupload)
app.use(url , express.static('view/'))
app.use(url , fileupload)

app.listen(8001 , function(req , res ){
    console.log('node server is running...'); 
})