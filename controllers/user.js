const User = require('../models/user')


exports.getUserById = (req,res,next,id) => {

    try {
        User.findById(id).then(user => {
            if(!user){
                return res.status(404).json({error: true,message: ["No user found!"]})
            }

            req.profile = user
            next()
        }).catch(error => {
            return res.status(400).json({error: true,message: ["Faild to load user details!",error]})
        })        
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }

}

exports.pushBlogToUser = (req,res) => {
    try {
        User.findByIdAndUpdate(req.profile._id,
            {$push: {'blogs': req.blog}}).then( user => {
                if(!user){
                    return res.status(404).json({error: true,message: ["No user found!"]})
                }

                return res.status(200).json({success: true,message: ["Blog Published!"]})

            })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.popBlogFromUser = (req,res) => {
    try {
        User.findByIdAndUpdate(req.profile._id,
            {$pull: {'blogs': req.blog._id}}).then( user => {
                if(!user){
                    return res.status(404).json({error: true,message: ["No user found!"]})
                }

                return res.status(200).json({success: true,message: ["Blog Removed!"]})

            })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}