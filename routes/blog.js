const router = require('express').Router()
const { isSignedIn,isAuthenticated } = require('../controllers/auth')
const { createBlog, getBlogById } = require('../controllers/blog')

router.post('/blog/create',createBlog)


module.exports = router