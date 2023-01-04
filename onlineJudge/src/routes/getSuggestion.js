const express = require('express');
const getSuggestion = require('../models/getSuggestion');
var router = express.Router();

router.route('/chatGPT_Result/:judgeNumber')
    // 取得所有資源

    .get(function (req, res) {        
        getSuggestion.chatGPT(req , function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
            res.send(results);
            return;
        })
    })



module.exports = router;   
    