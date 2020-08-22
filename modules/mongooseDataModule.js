/////////////////////////////////////////////////////////////////
/////////////        CONNECT TO THE DATA BASE        ////////////
/////////////////////////////////////////////////////////////////

const mongoose = require('mongoose')

// get password hash for the krypting the password 
const passwordHash = require('password-hash')

// create connection string
const connectionString = 'mongodb+srv://quiz_user:1234abcd@cluster0.bsy7q.mongodb.net/quiz?retryWrites=true&w=majority'

//get mongoose schema object from  mongoose
const Schema = mongoose.Schema




//////////////////////////////////////////////////////
/////////////        SCHEMAS              ////////////
//////////////////////////////////////////////////////

////////  questionSchema  ///////

const questionSchema = new Schema({

    Q: {
        type: String,
        required: true
    },

    A: {
        type: Number

    },
    C: {
        type: [String],
        required: true,
        min: 2
    },
    userid: {
        type: String,
        required: true
    }


})

////////   examSchema    ///////

const examSchema = new Schema({
    // exam_id: {
    //     type: String,
    //     required: true
    // },
    title: {
        type: String,
        unique: true
    },

    questions: {
        type: [String]
    }

});

////////   userSchema    ///////

// create a user schema for mongoDb
const userSchema = new Schema({

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        max: 100,
        min: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 100,
        min: 3
    }

})




/////////////////////////////////////////////////////////////////
/////////////        CREATE MODELS        ////////////
/////////////////////////////////////////////////////////////////

// connect the Question-Schema
const Questions = mongoose.model('questions', questionSchema)

// connect the Exams-Schema
const Exams = mongoose.model('exam', examSchema)

// connect the User-Schema
const Users = mongoose.model('users', userSchema)



/////////////////////////////////////////////////////////////////
/////////////////////     CONNECT  FUNCTION        ////////////////////
/////////////////////////////////////////////////////////////////
// connect to mongoDb
function connectFcn() {
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
            resolve()
        } else {
            mongoose.connect(connectionString, { // connect will return a promise... 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useNewUrlParser: true
            }).then(() => {
                resolve()
            }).catch(error => {
                reject(error)
            })
        }
    })
}


/////////////////////////////////////////////////////////////////
/////////////////////     QUESTIONS  FUNCTIONS        ////////////////////
/////////////////////////////////////////////////////////////////


// function to add a question to the database
function addQuestion(question, answer, ch1, ch2, ch3, userId) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            Questions.findOne({
                Q: question,
                userid: userId

            }).then(findQuestion => {
                if (findQuestion) {
                    reject(3)
                } else {
                    const choicesArr = []
                    choicesArr.push(ch1, ch2, ch3)

                    const newQuestion = new Questions({
                        Q: question,
                        A: answer,
                        C: choicesArr,
                        userid: userId
                    })

                    newQuestion.save().then(() => {
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })

                }
            }).catch(error => {
                reject(error)
            })

        }).catch(error => {
            reject(error)
        })
    })
}

// get the question from the database
// function getQuestion(id) {
    
//         connectFcn().then(() => {

//             Questions.findOne({
//                 _id: id
//             }).then(question => {

//                 if (question) {
//                     //question.id = question._id
//                     return(question)
//                 } else {
//                     return(new Error("can not find a question with this id:" + id))
//                 }
//             }).catch(error => {
//                 return(error)
//             })
//         }).catch(error => {
//             return(error)
//         })
    

// }

function getQuestion(id) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {

            Questions.findOne({
                _id: id
            }).then(question => {

                if (question) {
                    question.id = question._id
                    resolve(question)
                } else {
                    reject(new Error("can not find a question with this id:" + id))
                }
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })

}
function getQuestions(ids) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {

            Questions.find({
                _id: {$in : ids}
            }).then(questions => {

                resolve(questions)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })

}
// this function gets all the questions from the admin
function getAllQuestion() {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            Questions.find().then(questions => {
                if (questions) {
                    resolve(questions)
                } else {
                    reject(new Error("can not find this questions"))
                }

            }).catch(error => {
                reject(error)
            })

        }).catch(error => {
            reject(error)
        })

    })
}

// function findQuesions() {
//     return new Promise((resolve, reject) => {
//         connectFcn().then(() => {
//             Questions.find().then(questions => {
//                 if (questions) {
//                     resolve(questions)
//                 } else {
//                     reject(new Error("can not find this questions"))
//                 }

//             }).catch(error => {
//                 reject(error)
//             })

//         }).catch(error => {
//             reject(error)
//         })

//     })
// }
// this function is for editing the questions , choices and answer
function updatedQuestions(question, answer, ch1, ch2, ch3, questionid, userId) {
    return new Promise((resolve, reject) => {
        try { // with async function we need try catch to get an error- 

            // going to use iffy as this function will have many callings. and promises will be too nested. so i will use async await
            (async () => {

                let oldQuestionData = await getQuestion(questionid)

                console.log(oldQuestionData)

                if (!oldQuestionData) {
                    reject(new Error("Question does not exist"))
                }

                // need to find the choices that i need to delete
                const choicesArr = []
                choicesArr.push(ch1, ch2, ch3)

                await connectFcn()

                await Questions.updateOne({
                    _id: questionid
                }, {
                    Q: question,
                    A: answer,
                    C: choicesArr,
                    userid: userId
                })

                resolve()
            })()

        } catch (error) {
            reject(error)
        }

    })

}

// function to delete the question from the database
function deleteQuestion(questionid, userId) {
    return new Promise((resolve, reject) => {
        getQuestion(questionid).then(question => {
            if (question.userid === userId) {
                Questions.deleteOne({
                    _id: questionid
                }).then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            } else {
                reject(new Error('Nice Try Hacking :) '))
            }




        }).catch(error => {
            reject(error)
        })
    })
}

function deleteQuestionExam(questionid) {
    return new Promise((resolve, reject) => {
        getQuestion(questionid).then(question => {
            
                Questions.deleteOne({
                    _id: questionid
                }).then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            




        }).catch(error => {
            reject(error)
        })
    })
}
/////////////////////////////////////////////////////////////////
/////////////////////     EXAMS  FUNCTIONS        ////////////////////
/////////////////////////////////////////////////////////////////
function createExam(examTitle,questionsIds) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {


            
                const newExam = new Exams({
                title: examTitle,
                questions: questionsIds

            })

            newExam.save().then((exam) => {
                resolve()
            }).catch(error => {
                if (error.code === 11000) {
                    reject('exist')
                } else {
                    reject(error)
                }
            })
            




        }).catch(error => {
            reject(error)
        })
    })
}

// this function gets all the exams from the admin
function getAllExams() {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            Exams.find().then(exam => {
                if (exam) {
                    resolve(exam)
                } else {
                    reject(new Error("can not find this exam"))
                }

            }).catch(error => {
                reject(error)
            })

        }).catch(error => {
            reject(error)
        })

    })
}

function getExam(examId) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            //const db = client.db('test1')
            Exams.findOne({_id: examId}).then(foundExam => {
                //console.log(foundExam);
                //client.close()

                
                if (foundExam) {
                    
                    
                    
                    resolve(foundExam)
                    
                    
                    
                } else {
                    reject(new Error('can not find an exam with this id: ' + id))
                }
            }).catch(error => {
                //client.close()
                reject(error);
            })

        }).catch(error => {
            reject(error);

        })

    })
}


/////////////////////////////////////////////////////////////////
/////////////////////     USERS  FUNCTIONS        ////////////////////
/////////////////////////////////////////////////////////////////

// function to register the user 
function registerUser(username, email, password) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            // create new user
            const newUser = new Users({
                username: username,
                email: email,
                password: passwordHash.generate(password)

            })
            // save the new User in the database
            newUser.save().then(result => {
                console.log(result);
                resolve()
            }).catch(error => {
                console.log(error.code);
                if (error.code === 11000) {
                    reject('exists')
                } else {
                    reject(error)
                }
            })

        }).catch(error => {
            reject(error)
        })
    })

}

// function to check if the user exists
function checkUser(email, password) {
    // your code
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {

            Users.findOne({
                email: email
            }).then(user => {

                if (user) {
                    if (passwordHash.verify(password, user.password)) {
                        resolve(user)
                    } else {
                        reject(3)
                    }
                } else {
                    reject(3)
                }
            }).catch(error => {

                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}




// exporting the functions via module
module.exports = {
    /////  questions exports   ////
    addQuestion,
    getQuestion,
    updatedQuestions,
    getAllQuestion,
    deleteQuestion,
    getQuestions,
    deleteQuestionExam,
    ////   exams exports    ////
    createExam,
    getAllExams,
    getExam,
    

    ////   users exports    ////
    registerUser,
    checkUser
}