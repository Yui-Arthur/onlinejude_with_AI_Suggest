var express = require('express');
var flieupload = require('../models/fileupload');
var router = express.Router();

router.route('/fileupload')
    // 取得所有資源

    .post(function (req, res) {        
        flieupload.upload(req , function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }

            res.send(results);
            return;
        });
    })



module.exports = router;   
    