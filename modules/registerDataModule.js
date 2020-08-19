// get password hash for the krypting the password 
const passwordHash = require('password-hash')

// get the mongoose connected
const mongoose = require('mongoose')

// create connection string
const connectionString = 'mongodb+srv://quiz_user:1234abcd@cluster0.bsy7q.mongodb.net/quiz?retryWrites=true&w=majority'

//get mongoose schema object from  mongoose
const Schema = mongoose.Schema

// create a user schema for mongoDb
const userSchema = new Schema({

    username: {
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true,
        max: 100,
        min: 5 
    },
    email: {
        type: String,
        required : true,
        unique: true,
        max: 100,
        min: 3
    }
    
    // // adding verification to be able to verify user by id in log in
    // verification :{
    //     type: Boolean,
    //     required: true
    // }

})

// connect the User-Schema
const Users = mongoose.model('users', userSchema)

function  connectFcn() { 
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) { 
            resolve()
        }else {
            mongoose.connect(connectionString, {
                useUnifiedTopology:true,
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
function registerUser(username, email, password){
    return new Promise((resolve, reject)=>{
        connectFcn().then(()=>{
            // create new user
            const newUser = new Users({
                username: username,
                email: email,
                password: passwordHash.generate(password)
               
            })
            // save the new User in the database
            newUser.save().then(result =>{
                console.log(result);
                resolve()
            }).catch(error =>{
                console.log(error.code);
                if(error.code === 11000){
                    reject('exists')
                }else{
                    reject(error)
                }
            })

        }).catch(error=>{
            reject(error)
        })
    })
                
}

// function to check if the user exists
function checkUser(email, password) {
    // your code
    return new Promise((resolve, reject) => {
        connectFcn().then(() => {
            
            Users.findOne({email: email}).then(user => {
                
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

module.exports = {
    registerUser,
    checkUser
}