// const mongoose = require('mongoose')

// // create connection string
// const connectionString = 'mongodb+srv://quiz_user:1234abcd@cluster0.bsy7q.mongodb.net/quiz?retryWrites=true&w=majority'
// const dataModule = require('../modules/mongooseDataModule')
// //get mongoose schema object from  mongoose
// const Schema = mongoose.Schema

// const examSchema = new Schema({
//     exam_id: {
//         type: String,
//         required : true
//     },

//     questions: {
//         type: [String],
//         required: true
//     }
// })

// const examSchema = new Schema({
//     // exam_id: {
//     //     type: String,
//     //     required: true
//     // },
//     title: {
//         type: String
//     },

//     questions: {
//         type: [String]
//     }
        
// });

// connect the Question-Schema
// const Exams = mongoose.model('exam', examSchema)

// connect to mongoDb
// function connectFcn() {
//     return new Promise((resolve, reject) => {
//         if (mongoose.connection.readyState === 1) {
//             resolve()
//         } else {
//             mongoose.connect(connectionString, { // connect will return a promise... 
//                 useUnifiedTopology: true,
//                 useCreateIndex: true,
//                 useNewUrlParser: true
//             }).then(() => {
//                 resolve()
//             }).catch(error => {
//                 reject(error)
//             })
//         }
//     })
// }

// function createExam(question) {
//     return new Promise((resolve, reject) => {
//         connectFcn().then(() => {

//             const newExam = new Exams({
//                 title: 'quiz 1',
//                 questions: question,
                
//             })

//             newExam.save().then((exam) => {
//                 resolve(exam)
//             }).catch(error => {
//                 reject(error)
//             })




//         }).catch(error => {
//             reject(error)
//         })
//     })
// }

const quizzes = [{
    _id: '123',
    title: 'quiz 1'
}]

function findQuizById(qzid) {
    quizzes.find(quiz => {
        quiz._id == qzid
    }).populate('questions')
}
// module.exports = {
//     findQuizById,
//     createExam
// }