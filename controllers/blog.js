const Blog = require('../models/blog')

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

exports.createBlog = (req,res) => {
    const {title,blog} = req.body

    if(!title || title === '' || blog.length === 0){
        return res.status(400).json({error: true,message: ["All fields are required!"]})
    }

    try {
        let newBlog = Blog(req.body)
        newBlog.author = req.profile._id

        newBlog.save().then(createdBlog => {
            if(!createdBlog) {
                return res.status(400).json({error: true,message: ["Faild to publish blog!",error]})
            }
            return res.status(200).json({success: true,message: ["Blog Published!"]})
        }).catch(error => {
            return res.status(400).json({error: true,message: ["Faild to publish blog!",error]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}