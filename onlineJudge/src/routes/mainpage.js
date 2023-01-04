const express = require('express');
const mainpage = require('../models/mainpage');
var router = express.Router();

router.route('/:questionName')
    // 取得所有資源

    .get(function (req, res) {        
        mainpage.getPage(req , function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            console.log( req.params.questionName )
            questionName = req.params.questionName
            questionList = results[0];
            questionContent = results[1];

            res.render("index" , {questionName:questionName ,questionContent:questionContent, questionList: questionList});
            return;
        })
    })


router.route('/')
    .get(function (req, res) {        
        mainpage.getDefaltPage(req , function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            questionList = results[0];

            res.render("index" , {questionName:"Not Select" ,questionContent:"", questionList: questionList});
            return;
        })
    })

module.exports = router;   
    