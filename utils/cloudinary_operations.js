const config = require('../config/config')

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECCRET,
    secure: true
})

exports.uploadImage = image => {
    return cloudinary.uploader.upload(image,{folder: 'blogger'}).then(data => {
        return data
    }).catch(error => {
        return {error: error}
    })
}

exports.destroyImage = image => {
    return cloudinary.uploader.destroy(image).then(data => {
        return data
    }).catch(error => {
        return {error: error}
    })
}

exports.updateImage = (image,id) => {
    return cloudinary.uploader.upload(image,{invalidate: true,public_id: id}).then(data => {
        return data
    }).catch(error => {
        return {error: error}
    })
}