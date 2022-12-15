var express = require('express');
var bodyparser = require('body-parser');
// var conf = require('./conf.js');
var app = express();
var flieupload = require("./routes/fileupload");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static('view/'))
app.use(flieupload)

app.listen(8001 , function(req , res ){
    console.log('node server is running...'); 
})