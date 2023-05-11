const router = require('express').Router()
const { isSignedIn,isAuthenticated } = require('../controllers/auth')
const { createBlog, getBlogById } = require('../controllers/blog')
const { getUserById, pushBlogToUser } = require('../controllers/user')

router.param('userId',getUserById)

router.post('/blog/create/:userId',createBlog,pushBlogToUser)


module.exports = router