let { PythonShell } = require('python-shell')
const formidable = require('formidable');
const fs = require('fs');
const questionPath = "./question"
const sessionPath = ".config.ini"
const savePath = "./src/models/chatGPT"

module.exports = {
    
    upload: function (req , callback){

        var form = new formidable.IncomingForm();
        
        form.uploadDir = "./uploadfile/"
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.filepath;
            var newpath = './uploadfile/' + files.filetoupload.originalFilename;

            var questionName = files.filetoupload.originalFilename.split('.')[0]
            var lang = files.filetoupload.originalFilename.split('.')[1]

            console.log(questionName)
            console.log(lang)
            fs.rename(oldpath, newpath , function (err){

                if(err) console.error(err);

                // let options = {
                //     args:
                //       [
                //         //`${questionpath}`
                //         //`${newpath}`
                //       ]
                //   }
                // PythonShell.run('./src/models/Judge/judge.py', options ,function (err,  data) {
                    
                //     if (err) console.error(err);
                //     // callback(data);  
                //     //console.log(data);
                //     return callback(0,data);
                // })
                var questionArgc = questionPath+"/"+questionName
                var saveArgc = savePath+"/"+questionName+".txt"
                //'--judge_rst',"0",
                let options = {
                    args:
                      [
                        '--question' , questionArgc,
                        '--session' , sessionPath,
                        '--code' ,  newpath,
                        '--lang' , lang,
                        '--save' ,  saveArgc
                      ]
                  }

                PythonShell.run('./src/models/chatGPT/check_and_reply.py', options ,function (err,  data) {
                    
                    if (err) console.error(err);
                    // callback(data);
                    console.log("!");  
                    console.log(data);
                    return callback(0,data);
                })

                // PythonShell.run('./src/models/chatGPT/test.py', options ,function (err,  data) {

                //     if (err) console.error(err);
                    
                //     console.log("!");  
                //     console.log(data);
                //     return callback(0,data);
                // })

            });



        });

        
        
    },


    

}
