const Blog = require('../models/blog')
const formidable = require('formidable')
const _ = require('lodash')
const { uploadImage, updateImage, destroyImage } = require('../utils/cloudinary_operations')

exports.getBlogById = (req,res,next,id) => {

    try {
        Blog.findById(id)
        .populate("author","_id username profilePicture role")
        // .populate("comments")
        .then(blog => {
            if(!blog){
                return res.status(404).json({error: true,message: ["No blog found!"]})
            }

            req.blog = blog
            next()
        }).catch(error => {
            return res.status(400).json({error: true,message: ["Faild to load blog information!",error]})
        })        
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }

}

exports.getABlog = (req,res) => {
    req.blog.comments = undefined
    return res.status(200).json({success: true,data: req.blog})
}

exports.getAllBlogs = (req,res) => {
    let limit = req.query.limit || 20
    
    try {
        Blog.find()
            .limit(limit)
            .select("-comments")
            .then( blogs => {
                if(!blogs || blogs.length === 0){
                    return res.status(404).json({error: true,message: ["No blog found!"]})
                }

                return res.status(200).json({success: true,data: blogs})
            }).catch( err => {
                return res.status(400).json({error: true,message: ["Faild to load blogs!",err]})
            })        
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }

}

exports.createBlog = (req,res,next) => {
    try {
        const form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.parse(req,(err,fileds,files) => {
            if(err){
                return res.status(400).json({error: true,message: ["Error while processing blog!",err]})
            }

            const {title,blog} = fileds
            if(!title || title === '' || blog.length === 0){
                return res.status(400).json({error: true,message: ["All fields are required!"]})
            }

            let newBlog = Blog(fileds)
            newBlog.author = req.profile._id

            uploadImage(files.coverImage.filepath).then(response => {

                if(response.error){
                    return res.status(400).json({error: true,message: ["Faild to upload image!",response.error]})
                }

                const imageToStore = {
                    public_id: response.public_id,
                    version: response.version,
                    format: response.format,
                    url: `https://res.cloudinary.com/swayangdipta/image/upload/q_auto/v${response.version}/${response.public_id}.${response.format}`
                }
                newBlog.coverImage = imageToStore

                newBlog.save().then(createdBlog => {
                    if(!createdBlog) {
                        return res.status(400).json({error: true,message: ["Faild to publish blog!",error]})
                    }
                    req.blog = createdBlog._id
                    next()
                }).catch(error => {
                    return res.status(400).json({error: true,message: ["Faild to publish blog!",error]})
                })
            }).catch( ce => {
                return res.status(400).json({error: true,message: ["Image upload faild!",ce]})
            })
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.updateBlog = (req,res) => {
    try {
        const form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.parse(req,(err,fields,files)=>{
            if(err){
                return res.status(400).json({error: true,message: ["Error while processing blog!",err]})
            }

            let newBlog = req.blog
            newBlog = _.extend(newBlog,fields)

            updateImage(files.coverImage.filepath,req.blog.coverImage.public_id).then(response => {

                if(response.error){
                    return res.status(400).json({error: true,message: ["Faild to upload image!",response.error]})
                }

                const imageToStore = {
                    public_id: response.public_id,
                    version: response.version,
                    format: response.format,
                    url: `https://res.cloudinary.com/swayangdipta/image/upload/q_auto/v${response.version}/${response.public_id}.${response.format}`
                }
                
                newBlog.coverImage = imageToStore

                newBlog.save().then(createdBlog => {
                    if(!createdBlog) {
                        return res.status(400).json({error: true,message: ["Faild to update blog!",error]})
                    }

                    return res.status(200).json({success: true,message: ["Blog Updated!"]})
                }).catch(error => {
                    return res.status(400).json({error: true,message: ["Faild to update blog!",error]})
                })
            }).catch( ce => {
                return res.status(400).json({error: true,message: ["Image upload faild!",ce]})
            })
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.removeImage = (req,res,next) => {
    try {
        destroyImage(req.blog.coverImage.public_id).then(response => {

            if(response.error){
                return res.status(400).json({error: true,message: ["Faild to remove image!",response.error]})
            }

            Blog.deleteOne({_id: req.blog._id}).then(removedBlog => {
                if(!removedBlog) {
                    return res.status(400).json({error: true,message: ["Faild to remove blog!",error]})
                }
                next()
            }).catch(error => {
                return res.status(400).json({error: true,message: ["Faild to remove blog!",error]})
            })
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}