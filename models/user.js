const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1 } = require('uuid')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32
    },
    username: {
        type: String,
        required: true,
        maxlength: 32,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: 'https://avatars.dicebear.com/api/bottts/svg'
    },
    encryptedPassword: {
        type: String
    },
    salt: {
        type: String
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
    role: {
        type: Number,
        default: 0
    },
    accountStatus: {
        type: "String",
        default: "OK"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date
},{timestamps: true})

userSchema.virtual('password')
    .set(function(password){
        this._password = password
        this.salt = v1()
        this.encryptedPassword = this.securePassword(password)
        this.profilePicture = `https://avatars.dicebear.com/api/bottts/${this.username}.svg`
    }).get(function(){
        return this._password
    })

userSchema.methods = {
    authenticate: function(password){
        return this.encryptedPassword === this.securePassword(password)
    },
    securePassword: function(password){
        if(!password) return ''

        try {
            return crypto.createHmac("sha512",this.salt)
                            .update(password)
                            .digest('hex')
                        
        } catch (error) {
            return ''
        }
    },
    generateForgetPasswordToken: function(){
        const token = crypto.randomBytes(20).toString('hex')

        this.forgetPasswordToken = 
                crypto.createHash('sha256')
                .update(token)
                .digest('hex')

        this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000
        return token
    }
}

module.exports = mongoose.model("User",userSchema)