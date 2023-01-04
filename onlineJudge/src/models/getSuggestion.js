const fs = require('fs');
const questionPath = "./question"
const sessionPath = "./config.ini"
const savePath = "./src/models/chatGPT"
let { PythonShell } = require('python-shell')

module.exports = {
    
    chatGPT: function (req , callback){
        
        // xxx_123.cpp
        var questionName = req.params.judgeNumber.split('_')[0]
        var lang = req.params.judgeNumber.split('.')[1]
        var codePath = "./uploadfile/"+ req.params.judgeNumber
        console.log("!"+questionName)
        var questionArgc = questionPath+"/"+questionName
        var saveArgc = savePath+"/"+req.params.judgeNumber.split('.')[0]+".txt"
        var judge_rst = "1";
        let options = {
            args:
            [
                '--judge_rst',judge_rst,
                '--question' , questionArgc,
                '--session' , sessionPath,
                '--code' ,  codePath,
                '--lang' , lang,
                '--save' ,  saveArgc
                ]
            }

        PythonShell.run('./src/models/chatGPT/check_and_reply.py', options ,function (err,  data) {
            
            if (err) console.error(err);
            console.log(data);
            return callback(0,data);
        })
    },


}
