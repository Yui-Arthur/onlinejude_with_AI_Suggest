const fs = require('fs');


module.exports = {
    
    getPage: function (req , callback){
        
        var questionList = fs.readdirSync('./question');
        var questionContent = fs.readFileSync(`./question/${req.params.questionName}/content.txt`)
        

        
        callback(0,[questionList,questionContent])

    },
    

}
