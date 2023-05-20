const config = require('../config/config')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')
const crypto = require('crypto')

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
    console.log(username);
    if(username === '' || password === ''){
        return res.status(400).json({
            error: true,
            message: ["Fill all required fields!",'Insufficient data!']
        })
    }

    // Finding the user by username or email

    try {
        User.findOne({
            $or: [
            { email: {$eq: username}},
            { username: {$eq: username}}
            ]
        }).then( user =>{
            // user found
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
            
            const {_id,name,email,role,username,profilePicture} = user

            return res.status(200).json({
                token,
                user: {
                    _id,
                    name,
                    username,
                    email,
                    profilePicture,
                    role
                }
            })
        }).catch(err => {
            // Error handling
            if(err){
                return res.status(404).json({
                    error: true,
                    message: ["No user found!",err]
                })
            }
        })        
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Something went wrong.Try again!",error]
        })
    }
}

// Middlewares Controllers

exports.isSignedIn = expressjwt({
    secret: config.SECRET,
    algorithms: ["SHA256","SHA512","HS256","RS256","sha1",'RSA'],
    userProperty: "auth"
})

exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id === req.auth._id

    if(!checker){
        return res.status(401).json({error: true,message: ["Unauthorized.","No Authorizatiion token found!"]})
    }

    next()
}

exports.isAdmin = (req,res,next) => {
    if(!(req.profile.role >= 5 && req.auth.role >= 5)){
        return res.status(401).json({error: true,message: ["You don't have admin access.","Not admin","Don't act smart"]})
    }

    next()
}

// Password Reset controllers

exports.getResetPasswordURL = (req,res) => {
    const {email} = req.body

    if(!email || email === null){
        return res.status(400).json({error: true,message: ["Please provide an email"]})
    }

    try {
        User.findOne({email: {$eq: email}}).then(async user => {
            if(!user){
                return res.status(404).json({error:true, message:["No User Found"]})
            }
            
            let resetToken = await user.generateForgetPasswordToken()
            user.save({validateBeforeSave: false}).then(doc => {
                let resetUrl = `${req.headers.origin}/password/reset/${resetToken}`
                // Currently logging to console but later will get emailed
                console.log(resetUrl);
                return res.status(200).json({success: true,message: ["Password reset link sent!"]})
            })
        }).catch(err => {
            return res.status(400).json({error: true,message: ["Faild to generate reset url!",err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong",error]})
    }
}

exports.resetPassword = (req,res) => {
    const {token: resetToken} = req.query
    const {password, confirmPassword} = req.body

    if(!password || !confirmPassword || password !== confirmPassword){
        return res.status(400).json({error: true,message: ["Passwords did not matched!"]})
    }

    console.log(resetToken)
    const resetPasswordToken = 
            crypto.createHash('sha256')
                    .update(resetToken)
                    .digest("hex")

    try {
        User.findOne({
            forgetPasswordToken: resetPasswordToken,
            forgetPasswordExpiry: {$gt: Date.now()}
        }).then(user => {
            if(!user){
                return res.status(404).json({error:true, message:["No User Found"]})
            }

            user.password = password
            user.forgetPasswordExpiry = undefined
            user.forgetPasswordToken = undefined

            user.save().then(updatedUser => {
                if(!createdBlog) {
                    return res.status(400).json({error: true,message: ["Faild to reset password!",error]})
                }
                return res.status(200).json({success: true,message: ["Password reset success"]})
            }).catch(error => {
                return res.status(400).json({error: true,message: ["Faild to reset password!",error]})
            })
        }).catch(err => {
            if(err){
                return res.status(400).json({error:true, message:["Faild to get user details!",err]})
            }
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong",error]})
    }
}