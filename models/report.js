const mongoose = require('mongoose')


const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    reportedItem: {
        type: Object,
        default: {}
    },
    reportStatus: {
        type: String,
        default: 'Open',
        enum: ['Open','Solved','Processing']
    },
    reportCause: {
        type: String,
        default: "Not Mentioned",
        enum: ['Not Mentioned','Explicit','Hate','Illegal','Spam','Violence','Threat']
    }
},{timestamps: true})

module.exports = mongoose.model('Report',reportSchema)