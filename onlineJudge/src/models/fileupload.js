let { PythonShell } = require('python-shell')
const formidable = require('formidable');
const fs = require('fs');

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

                let options = {
                    args:
                      [
                        `--lang ${lang}`,
                        `--questionName ${questionName}`
                      ]
                  }
                PythonShell.run('./Judge/check_and_reply.py', options ,function (err,  data) {
                    
                    if (err) console.error(err);
                    // callback(data);  
                    console.log(data);
                    return callback(0,data);
                })

            });



        });

        
        
    },


    

}
