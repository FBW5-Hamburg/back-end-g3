// connect the dependencies express
const express = require('express')
//include data module
const dataModule = require('../modules/mongooseDataModule')
const registerDataModule = require('../modules/registerDataModule')
const adminRouter = express.Router()




// admin panel handler
adminRouter.get('/', (req, res)=>{
    res.render('adminPanel')
})

adminRouter.get('/addQuestion', (req, res) => {
    
    res.render('addQuestion')
});




adminRouter.post('/addQuestion', (req, res) => {
    console.log(req.body);
    const question = req.body.question
    const answer = req.body.answer
    const choice1 = req.body.choice1
    const choice2 = req.body.choice2
    const choice3 = req.body.choice3
    if (question && answer && choice1 && choice2 && choice3) {
        //const imgs=[]
        //imgs.push(choice1,choice2,choice3)
        dataModule.addQuestion(question,answer,choice1,choice2,choice3, '1').then(() =>{
            res.json(1)
        }).catch(error => {
            if (error == 3) {
                res.json(3)
            }
        })
    } else {
        res.json(2)
    }
    //addQuestion(question,answer,ch1,ch2,ch3, userid) 
});

// render all the questions from the database
adminRouter.get('/getAllQuestion', (req,res)=>{

    dataModule.getAllQuestion().then((questions)=>{
        
        res.render('getAllQuestions', {questions})
    }).catch(error =>{
       
     res.json(2)
        
    })
 
})

adminRouter.get('/editQuestions', (req, res) => {
    console.log(req.body);
    // const questions = [
    //     {'Q':'How do you write "Hello World" in an alert box?', 'A':2,'C':['msg("Hello World");','alert("Hello World");','alertBox("Hello World");']},
    //     {'Q':'How do you create a function in JavaScript?', 'A':3,'C':['function:myFunction()','function = myFunction()','function myFunction()']},
    //     {'Q':'How to write an IF statement in JavaScript?', 'A':1,'C':['if (i == 5)','if i = 5 then','if i == 5 then']},
    //     {'Q':'How does a FOR loop start?', 'A':2,'C':['for (i = 0; i <= 5)','for (i = 0; i <= 5; i++)','for i = 1 to 5']},
    //     {'Q':'What is the correct way to write a JavaScript array?', 'A':3,'C':['var colors = "red", "green", "blue"','var colors = (1:"red", 2:"green", 3:"blue")','var colors = ["red", "green", "blue"]']}
    // ];
    dataModule.getAllQuestion().then((questions)=>{
        
        res.render('editQuestions', {questions})
    }).catch(error =>{
       
     res.json(2)
        
    })
 
})

adminRouter.post('/editQuestions', (req,res)=>{
    console.log(req.body)

//NOTE check the note in the editQuestion ejs the name of the parameters are given there
const newQuestion = req.body.question
const newAnswer = req.body.answer
const newChoice1 = req.body.choice1
const newChoice2 = req.body.choice2
const newChoice3 = req.body.choice3
const questionid = req.body.questionid

if(newQuestion && newAnswer && newChoice1 &&  newChoice2 && newChoice3 && questionid){
  
    dataModule.updatedQuestions(newQuestion, newAnswer, newChoice1, newChoice2, newChoice3, questionid).then(()=>{

        res.json(1)
    }).catch(error =>{

        if(error == 3){
            res.json(3)
        }
    })
  } else {
      res.json(2)
  }

})

/// delete question handler 

adminRouter.post('/deleteQuestions', (req, res) => {
    console.log(req.body)
     
 const deleteQuestionId =  req.body.deleteQuestionId

    dataModule.deleteQuestion(deleteQuestionId).then(() =>{
        res.json(1)
    }).catch(error =>{
        res.json(2)
    })
})


// adminRouter.get('/logout', (req, res) => {
//     req.session.destroy()
//     res.redirect('/login')
// });




module.exports = adminRouter