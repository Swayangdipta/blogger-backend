const Category = require('../models/Category')

exports.getCategoryById = (req,res,next,id) => {
    try{
        Category.findById(id)
        .populate('blogs')
        .then((category) => {
            if(!category){
                return res.status(404).json({error: true,message: ['Faild to get category!','']})
            }
            req.category = category
            next()
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while fetching category!',err]})
        })
    }catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }

}

exports.getAllCategories = (req,res) => {
    try{
        Category.find()
        .select('-blogs')
        .then((categories) => {
            if(!categories){
                return res.status(404).json({error: true,message: ['Faild to get categories!','']})
            }

            return res.status(200).json({success: true,data: categories})
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while fetching categories!',err]})
        })
    }catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.getCategory = (req,res) => {
    if(req.category){
        return res.status(200).json({success: true,data: req.category})
    }

    return res.status(404).json({error: true,message: ['Not Found!','']})
}


exports.createCategory = (req,res) => {
    if(req.body.name === '' || !req.body.name) {
        return res.status(400).json({error: true, message: ['Can not create category without a name!','']})
    }

    try {
        const category = new Category(req.body)

        category.save().then(createdCategory => {
            if(!createdCategory){
                return res.status(400).json({error: true,message:['Faild to create category!','']})
            }

            return res.status(200).json({success: true,data: category.name})
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while creating category!',err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.pushIntoCategory = (req,res) => {
    try {
        Category
        .findByIdAndUpdate(req.categoryId,{$push: {"blogs": req.blog}})
        .then(category => {
            if(!category){
                return res.status(400).json({error: true,message: ['Faild to save data into category!','']})
            }

            return res.status(200).json({success: true,message: ["Blog Published!"]})
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while saving into category!',err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}


exports.popFromCategory = (req,res,next) => {
    try {
        Category
        .findByIdAndUpdate(req.category._id,{$pull: {"blogs": req.blog._id}})
        .then(category => {
            if(!category){
                return res.status(400).json({error: true,message: ['Faild to remove blog from category!','']})
            }
            next()
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while removing from category!',err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}