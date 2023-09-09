const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        required: true,
        unique: true,
        type: String
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
},{timestamps: true})

module.exports = mongoose.model('Category',categorySchema)