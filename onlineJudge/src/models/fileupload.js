let { PythonShell } = require('python-shell')
const formidable = require('formidable');
const fs = require('fs');
const questionPath = "./question"

module.exports = {
    
    upload: function (req , callback){

        var form = new formidable.IncomingForm();
        
        form.uploadDir = "./uploadfile/"
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.filepath;
            var newpath = './uploadfile/' + files.filetoupload.originalFilename;

            var questionName = files.filetoupload.originalFilename.split('_')[0]
            var lang = files.filetoupload.originalFilename.split('.')[1]

            console.log(questionName)
            console.log(lang)
            fs.rename(oldpath, newpath , function (err){

                if(err) console.error(err);
                
                var questionArgc = questionPath+"/"+questionName
                var saveArgc = savePath+"/"+questionName+".txt"

                let options = {
                    args:
                      [
                        questionpath,
                        newpath,
                      ]
                  }
                PythonShell.run('./src/models/Judge/judge.py', options ,function (err,  data) {
                    
                    if (err) console.error(err);
                    // callback(data);  
                    //console.log(data);
                    return callback(0,data);
                })




            });



        });

        
        
    },


    

}
