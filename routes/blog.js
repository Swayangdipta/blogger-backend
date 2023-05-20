const router = require('express').Router()
const { isSignedIn,isAuthenticated } = require('../controllers/auth')
const { createBlog, getBlogById, getAllBlogs, getABlog, updateBlog } = require('../controllers/blog')
const { getUserById, pushBlogToUser } = require('../controllers/user')

router.param('userId',getUserById)
router.param('blogId',getBlogById)

router.post('/blog/create/:userId',createBlog,pushBlogToUser)
router.get('/blogs',getAllBlogs)
router.get('/blog/:blogId',getABlog)
router.put('/blog/update/:userId/:blogId',updateBlog)


module.exports = router