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

exports.pushBlogToUser = (req,res,next) => {
    try {
        User.findByIdAndUpdate(req.profile._id,
            {$push: {'blogs': req.blog}}).then( user => {
                if(!user){
                    return res.status(404).json({error: true,message: ["No user found!"]})
                }
                next()
            }).catch(err => {
                return res.status(400).json({error: true,message: ["Faild to add blog to user!",err]})
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

            }).catch(err => {
                return res.status(400).json({error: true,message: ["Faild to remove blog from user!",err]})
            })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.likeAndDislikeBlog = (req,res,next) => {
    try {
        let updateValue
        if(req.body.type === 'like'){
            updateValue = {$set: {[`likes.${req.blog._id}`]: true}}
        }else if(req.body.type === 'dislike'){
            updateValue = {$unset: {[`likes.${req.blog._id}`]: 1}}
        }else{
            return res.status(400).json({error: true,message: ["Unknown Operation!",error]})
        }

        User.findByIdAndUpdate(req.profile._id,updateValue,{new: true}).then(user => {
            if(!user){
                return res.status(404).json({error: true,message: ["No user found!"]})
            }

            next()
        }).catch(err => {
            return res.status(400).json({error: true,message: ["Faild to like/dislike blog!",err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.getLikedBlogs = (req,res) => {
    if(req.profile){
        return res.status(200).json({success: true,data: req.profile.likes})
    }

    return res.status(404).json({error: true,message: ["Faild to get liked blogs!",err]})
}