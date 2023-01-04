const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mainpage = require('./routes/mainpage')
const fileupload = require("./routes/fileupload");
const getSuggestion = require("./routes/getSuggestion");


app.set('view engine', 'ejs');
const url = "/OnlineJudge/"

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());



// app.use(express.static('view/'))
// app.use(fileupload)
app.use(url , express.static('views'))
// app.use(url , express.static('views/css'))
app.use(url , mainpage)
app.use(url , fileupload)
app.use(url , getSuggestion)

app.listen(8001 , function(req , res ){
    console.log('node server is running...'); 
})