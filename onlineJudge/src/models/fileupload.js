let { PythonShell } = require('python-shell')
var formidable = require('formidable');
var fs = require('fs');
module.exports = {
    
    upload: function (req , callback){

        var form = new formidable.IncomingForm();
        
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.filepath;
            var newpath = './uploadfile/' + files.filetoupload.originalFilename;
            fs.rename(oldpath, newpath , function (){
                let options = {
                    args:
                      [
                        "-p 1234",
                        "-v 467"
                      ]
                  }
                PythonShell.run('./uploadfile/test.py', options ,function (err,  data) {
                    
                    // if (err) console.error(err);
                    // callback(data);  
                    // console.log(data);
                    return callback(0,data);
                })

            });



        });

        
        
    },


    

}