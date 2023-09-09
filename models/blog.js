const mongoose = require('mongoose')
const { v1 } = require('uuid')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    coverImage: {
        type: String,
        default: 'https://placekitten.com/640/320'
    },
    blog: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        default: []
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
},{timestamps: true})

module.exports = mongoose.model("Blog",blogSchema)