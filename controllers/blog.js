const Blog = require('../models/blog')
const formidable = require('formidable')
const { uploadImage } = require('../utils/cloudinary_operations')

exports.getBlogById = (req,res,next,id) => {

    try {
        Blog.findById(id).then(blog => {
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

                const imageToStore = `https://res.cloudinary.com/swayangdipta/image/upload/q_auto/v${response.version}/${response.public_id}.${response.format}`
                
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