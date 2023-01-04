const fs = require('fs');


module.exports = {
    
    getPage: function (req , callback){
        
        var questionList = fs.readdirSync('./question');


        var questionContent = fs.readFileSync(`./question/${req.params.questionName}/description.txt` ,{encoding:'utf8', flag:'r'})
        
        var questionContentList = questionContent.split('\n')
        
        
        
        
        callback(0,[questionList,questionContentList])

    },

    getDefaltPage: function (req , callback){
        
        var questionList = fs.readdirSync('./question');


        //var questionContent = fs.readFileSync(`./question/${req.params.questionName}/content.txt`)
        

        
        callback(0,[questionList])

    },
    

}
