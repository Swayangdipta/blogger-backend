const Blog = require('../models/blog')
const formidable = require('formidable')
const _ = require('lodash')
const { uploadImage, updateImage, destroyImage } = require('../utils/cloudinary_operations')
const { v4 } = require('uuid')

exports.getBlogById = (req,res,next,id) => {

    try {
        Blog.findById(id)
        .populate("author","_id username profilePicture")
        .populate("category","_id name")
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

exports.getBlogsCount = (req,res) => {
    try {
        Blog.countDocuments().then(counts => {
            if(!counts){
                return res.status(404).json({error: true,message: ["No blog found!"]})
            }

            return res.status(200).json({success: true,data: counts})
        }).catch(error => {
            return res.status(400).json({error: true,message: ["Faild to load blog information!",error]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.getAllBlogs = (req,res) => {
    let limit = parseInt(req.query.limit) || 10
    let pageNumber = parseInt(req.query.page) || 1

    console.log(limit + "----" + pageNumber);

    try {
        Blog.aggregate([
            {
                $sort: {createdAt: -1}
            },
            {
                $skip: (pageNumber - 1) * limit
            },
            {
                $addFields: {commentCount: {$size: '$comments'}}
            },
            {
                $project: {
                    comments: 0,
                    blog: 0,
                    author: 0
                }
            },
            {
                $limit: limit
            }
        ]).then( blogs => {
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

exports.getBlogComments = (req,res) => {
    return res.status(200).json({success: true,data: req.blog.comments.slice(req.query.count,req.query.count + 10)})
}

exports.createBlog = (req,res,next) => {
    try {
        const {title,blog,category,description} = req.body

        if(!title || !blog || !category || !description){
            return res.status(400).json({error: true,message: ["All fields are required!",'']})
        }

        let newBlog = new Blog(req.body)
        newBlog.author = req.profile._id

        newBlog.save().then(createdBlog => {
            if(!createdBlog) {
                return res.status(400).json({error: true,message: ["Faild to publish blog!",'']})
            }
            req.blog = createdBlog._id
            req.categoryId = createdBlog.category
            next()
        }).catch(err => {
            return res.status(400).json({error: true,message: ["Faild to publish blog!",err]})
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

exports.updateBlogLike = (req,res) => {
    try {
        let updateValue 
        if(req.body.type === 'like'){
            updateValue = 1
        }else if(req.body.type === 'dislike'){
            updateValue = -1
        }else{
            return res.status(400).json({error: true,message: ["Unknown Operation!",error]})
        }

        Blog.findByIdAndUpdate(req.blog._id,{$inc: {'likes': updateValue}},{new : true}).then(blog => {
            if(!blog){
                return res.status(404).json({error: true,message: ["No blog found!"]})
            }

            return res.status(200).json({success: true,message: ["Success"]})
        }).catch(err => {
            return res.status(400).json({error: true,message: ["Faild to add like/dislike in blog!",err]})
        })

    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.increaseViews = (req,res) => {
    try {
        Blog.findByIdAndUpdate(req.blog._id,{$inc: {'views': 1}},{new : true}).then(blog => {
            if(!blog){
                return res.status(404).json({error: true,message: ["No blog found!"]})
            }

            return res.status(200).json({success: true,message: ["Success"]})
        }).catch(err => {
            return res.status(400).json({error: true,message: ["Faild to add like/dislike in blog!",err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.searchBlog = (req,res) => {
    try{
        const query = req.body.query
        if ( query === '') {
            return res.status(400).json({ error: true, message: ['Query fields are required!',''] });
          }
        Blog.find({
            $or : [
                {title: { $regex: new RegExp(query, 'i') }},
                {description: { $regex: new RegExp(query, 'i') }},
                {blog: { $regex: new RegExp(query, 'i') }}
            ]
        }).select('title description coverImage likes views _id')
        .then((blogs) => {
          return res.status(200).json({ success: true, data: blogs });
        })
        .catch((err) => {
          return res.status(400).json({ error: true, message: ['Faild to search blogs!',err] });
        })
    }catch(error){
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.addComment = (req,res) => {
    try {
        const {comment,id} = req.body
        let newComment = {
            comment,
            id: v4(),
            authorId: req.profile._id,
            authorImage: req.profile.profilePicture,
            createdAt: new Date()
        }

        Blog.findByIdAndUpdate(req.blog._id,{$push: {'comments': newComment}}).then(blog => {
            if(!blog){
                return res.status(404).json({error: true,message: ["No blog found!"]})
            }

            return res.status(200).json({success: true,message: ["Success"]})
        }).catch(err => {
            return res.status(400).json({error: true,message: ["Faild to add comment!",err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.removeComment = (req,res) => {
    try {
        const {id} = req.body

        Blog.findByIdAndUpdate(req.blog._id,{$pull: {'comments': {id: id}}}).then(blog => {
            if(!blog){
                return res.status(404).json({error: true,message: ["No blog found!"]})
            }

            return res.status(200).json({success: true,message: ["Success"]})
        }).catch(err => {
            return res.status(400).json({error: true,message: ["Faild to remove comment!",err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}