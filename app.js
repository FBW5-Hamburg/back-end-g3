// connect the dependencies
const express = require('express')
const session = require('express-session')
const path = require('path')

// end connecting dependencies

//include data Module

const dataModule = require('./modules/mongooseDataModule')

const adminRouter = require('./routes/adminRoute')


/// use the Middleware ///

const app = express()

// user url parser from express 
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// set the public folder url 
app.use(express.static(path.join(__dirname, 'public')))

const sessionOptions = {
    secret: 'questionstore',
    resave: false,
    saveUninitialized: false,
   // cookie: {} //secure when we have https in the path
}
//use a session
app.use(session(sessionOptions))
// set view engine and views path
app.set('view engine', 'ejs')
app.set('views', 'views');

// session options 
// const sessionOptions = {
//     secret: 'quiz',
//     resave: false,
//     saveUninitialized: false,
//     }
// use the session
// app.use(session(sessionOptions))


// connect to the adminRouter 
app.use('/admin', adminRouter);

/// ----- END -----///

// main page questionary
app.get('/', (req, res)=>{
    // const options = [
    //     {'Q':'How do you write "Hello World" in an alert box?', 'A':2,'C':['msg("Hello World");','alert("Hello World");','alertBox("Hello World");']},
    //     {'Q':'How do you create a function in JavaScript?', 'A':3,'C':['function:myFunction()','function = myFunction()','function myFunction()']},
    //     {'Q':'How to write an IF statement in JavaScript?', 'A':1,'C':['if (i == 5)','if i = 5 then','if i == 5 then']},
    //     {'Q':'How does a FOR loop start?', 'A':2,'C':['for (i = 0; i <= 5)','for (i = 0; i <= 5; i++)','for i = 1 to 5']},
    //     {'Q':'What is the correct way to write a JavaScript array?', 'A':3,'C':['var colors = "red", "green", "blue"','var colors = (1:"red", 2:"green", 3:"blue")','var colors = ["red", "green", "blue"]']}
    // ];
    dataModule.getAllQuestion().then((questions)=>{
        console.log(questions);
        const options= questions
        res.json(questions)
        // res.render('main2' , {options: JSON.stringify( options)})
    }).catch(error =>{
       
     console.log(error);
        
    })
    
    
});
 
app.get('/exam', (req, res)=>{
    // const options = [
    //     {'Q':'How do you write "Hello World" in an alert box?', 'A':2,'C':['msg("Hello World");','alert("Hello World");','alertBox("Hello World");']},
    //     {'Q':'How do you create a function in JavaScript?', 'A':3,'C':['function:myFunction()','function = myFunction()','function myFunction()']},
    //     {'Q':'How to write an IF statement in JavaScript?', 'A':1,'C':['if (i == 5)','if i = 5 then','if i == 5 then']},
    //     {'Q':'How does a FOR loop start?', 'A':2,'C':['for (i = 0; i <= 5)','for (i = 0; i <= 5; i++)','for i = 1 to 5']},
    //     {'Q':'What is the correct way to write a JavaScript array?', 'A':3,'C':['var colors = "red", "green", "blue"','var colors = (1:"red", 2:"green", 3:"blue")','var colors = ["red", "green", "blue"]']}
    // ];

    dataModule.findAllQuizzes().then(allQuizes => {
        res.json(allQuizes)
    })
    
    console.log(req.params);
    // dataModule.getAllQuestion().then((questions)=>{
    //     console.log(questions);
    //     const options= questions
    //     res.render('main2' , {options: JSON.stringify( options)})
    // }).catch(error =>{
       
    //  console.log(error);
        
    // })
    
    
});
app.get('/exam/:examId', (req, res)=>{
    // const options = [
    //     {'Q':'How do you write "Hello World" in an alert box?', 'A':2,'C':['msg("Hello World");','alert("Hello World");','alertBox("Hello World");']},
    //     {'Q':'How do you create a function in JavaScript?', 'A':3,'C':['function:myFunction()','function = myFunction()','function myFunction()']},
    //     {'Q':'How to write an IF statement in JavaScript?', 'A':1,'C':['if (i == 5)','if i = 5 then','if i == 5 then']},
    //     {'Q':'How does a FOR loop start?', 'A':2,'C':['for (i = 0; i <= 5)','for (i = 0; i <= 5; i++)','for i = 1 to 5']},
    //     {'Q':'What is the correct way to write a JavaScript array?', 'A':3,'C':['var colors = "red", "green", "blue"','var colors = (1:"red", 2:"green", 3:"blue")','var colors = ["red", "green", "blue"]']}
    // ];

    dataModule.findQuizById(req.params['examId']).then( quiz =>{
        res.json(quiz)
    })
    
    console.log(req.params);
    // dataModule.getAllQuestion().then((questions)=>{
    //     console.log(questions);
    //     const options= questions
    //     res.render('main2' , {options: JSON.stringify( options)})
    // }).catch(error =>{
       
    //  console.log(error);
        
    // })
    
    
});

// register page handler
app.get('/registerUser', (req, res)=>{
    res.render('registerUser')
})

// register page handler
app.post('/registerUser', (req, res)=>{
    console.log(req.body);
   //this is the register post handler
   //1 means user registered successfully //  res.json(1)
   //2 means data error // res.json(2)
   //3 means user exists
   //4 means server error
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const passwordRep = req.body.passwordRep
    if(email && password && password == passwordRep){
        dataModule.registerUser(username.trim(),email.trim(),password).then(()=>{
        res.json(1)
        }).catch(error=>{
            console.log(error);
            if(error == 'exist'){
                res.json(3)
            } else{
                res.json(4)
            }
            
        })
    } else{
        res.json(2)
    }
    
});





// admin login page handler
app.get('/login', (req, res)=>{
    // res.render('loginUser')
    if (req.session.user) {
        res.redirect('/admin')
    } else {
        res.render('loginUser')
    }
})

app.post('/login', (req, res) => {
    console.log(req.body);
    if (req.body.email && req.body.password) {
        dataModule.checkUser(req.body.email.trim(),req.body.password).then(user => {
            
            req.session.user = user
            console.log(req.session.user);
            res.json(1)
        }).catch(error => {
            if (error == 3) {
                res.json(3)
            }else{
                res.json(4)
            }
        })
    }else {
        res.json(2)
    }
    
});



app.get('/showExam', (req, res) => {
    
    
    dataModule.createExam().then((exam)=>{
        console.log(exam);
        res.json(exam)
    }).catch(error =>{
       
     res.json(2)
        
    })
});

app.listen(3000, ()=>{
    console.log('App is listening on port 3000!');
});