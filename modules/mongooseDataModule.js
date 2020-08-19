const mongoose = require('mongoose')
// create connection string
const connectionString = 'mongodb+srv://quiz_user:1234abcd@cluster0.bsy7q.mongodb.net/quiz?retryWrites=true&w=majority'

//get mongoose schema object from  mongoose
const Schema = mongoose.Schema

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

// connect the Question-Schema
const Questions = mongoose.model('questions', questionSchema)

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

// this function is for editing the questions , choices and answer
function updatedQuestions(question, answer, ch1, ch2, ch3, questionid , userId) {
    return new Promise((resolve, reject) => {
        try { // with async function we need try catch to get an error- 

            // going to use iffy as this function will have many callings. and promises will be too nested. so i will use async await
            (async () => {

                let oldQuestionData = await getQuestion(questionid)

                console.log(oldQuestionData)

                if(!oldQuestionData){
                    reject( new Error("Question does not exist"))
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

// export function getAllQuestion1() {
    
//             connectFcn().then(() => {
//                     Questions.find().then(questions => {
//                         if (questions) {
//                             return(questions)
//                         } else {
//                             return(new Error("can not find this questions"))
//                         }

//                     }).catch(error => {
//                         return(error)
//                     })

//             }).catch(error => {
//                 return(error)
//             })

    
// }

// exporting the functions via module
module.exports = {
    addQuestion,
    getQuestion,
    updatedQuestions,
    getAllQuestion,
    deleteQuestion,
}