const config = require('../config/config')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.register = (req,res) => {
    const {name,email,password,username} = req.body

    if(name === '' || email === '' || password === '' || username === ''){
        return res.status(400).json({
            error: true,
            message: ["Fill all required fields!",'Insufficient data!']
        })
    }

    let user = new User(req.body)

    try {
        user.save().then(resp=>{
            return res.status(200).json({
                success: true,
                message: ["Registration complete.Login to continue."]
            })
        }).catch(err => {
            return res.status(400).json({
                error: true,
                message: ["Faild to register!",err]
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Something went wrong.Try again!",error]
        })
    }
}

exports.login = (req,res) => {
    const {username,password} = req.body

    if(username === '' || password === ''){
        return res.status(400).json({
            error: true,
            message: ["Fill all required fields!",'Insufficient data!']
        })
    }

    // Finding the user by username or email

    try {
        User.find({
            $or: [
            { email: {$eq: username}},
            { username: {$eq: username}}
            ]
        }).exec((user,err)=>{
            // Error handling
            if(err){
                return res.status(400).json({
                    error: true,
                    message: [err]
                })
            }else if(!user){
                return res.status(404).json({
                    error: true,
                    message: ["No user found!"]
                })
            }

            // If no error and user found
            // Match Passwords
            if(!user.authenticate(password)){
                return res.status(404).json({
                    error: true,
                    message: ["Username or password did not matched!"]
                })
            }
            
            // Creating and setting token for authorization/access
            let token = jwt.sign({_id:user._id,username: user.username},config.SECRET)
            res.cookie("token",token,{expiry: new Date(Date.now()+2.592e+9)})
            
            const {_id,name,email,role,username} = user

            return res.status(200).json({
                token,
                user: {
                    _id,
                    name,
                    username,
                    email,
                    role
                }
            })
        })        
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Something went wrong.Try again!",error]
        })
    }
}