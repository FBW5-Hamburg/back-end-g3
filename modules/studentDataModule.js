// get password hash for the krypting the password 
const passwordHash = require('password-hash')

// get the mongoose connected
const mongoose = require('mongoose')

// create connection string
const connectionString = 'mongodb+srv://quiz_user:1234abcd@cluster0.bsy7q.mongodb.net/quiz?retryWrites=true&w=majority'

//get mongoose schema object from  mongoose
const Schema = mongoose.Schema

// create a user schema for mongoDb
const studentSchema = new Schema({

    studentName: {
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

    // score: {
    //     type:Number,
    //     required: true
    // }
    // // adding verification to be able to verify user by id in log in
    // verification :{
    //     type: Boolean,
    //     required: true
    // }

})

// connect the User-Schema
const Student = mongoose.model('students', studentSchema)

function connectFcn() {
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
            resolve()
        } else {
            mongoose.connect(connectionString, {
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


// function to register the user 
function registerStudent(studentname, email, password, userId) {
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            Student.findOne({
                email: email
            }).then(findStudent => {
                if (findStudent) {
                    reject(3)
                } else {
                    // create new user
                    const newStudent = new Student({
                        studentName: studentname,
                        email: email,
                        password: passwordHash.generate(password),
                        userid: userId

                    })
                    // save the new User in the database
                    newStudent.save().then(result => {
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
                }
            }).catch(error => {
                reject(error)
            })


        }).catch(error => {
            reject(error)
        })
    })

}


module.exports = {
    registerStudent
}