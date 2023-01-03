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
            console.log(oldpath)
            console.log(newpath)
            fs.rename(oldpath, newpath , function (err){

                if(err) console.error(err);

                let options = {
                    args:
                      [
                        "-p 1234",
                        "-v 467"
                      ]
                  }
                PythonShell.run('./Judge_and_chatGPT/check_and_reply.py', options ,function (err,  data) {
                    
                    if (err) console.error(err);
                    // callback(data);  
                    console.log(data);
                    return callback(0,data);
                })

            });



        });

        
        
    },


    

}
