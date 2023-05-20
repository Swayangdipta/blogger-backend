const mongoose = require('mongoose')
const { v1 } = require('uuid')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    coverImage: {
        type: Object,
        default: {
            url:'https://placekitten.com/640/320'
        }
    },
    blog: [],
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

module.exports = mongoose.model("Blog",blogSchema)