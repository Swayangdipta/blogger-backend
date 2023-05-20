const router = require('express').Router()
const { isSignedIn,isAuthenticated } = require('../controllers/auth')
const { createBlog, getBlogById, getAllBlogs, getABlog, updateBlog, removeImage } = require('../controllers/blog')
const { getUserById, pushBlogToUser, popBlogFromUser } = require('../controllers/user')

router.param('userId',getUserById)
router.param('blogId',getBlogById)

router.post('/blog/create/:userId',createBlog,pushBlogToUser)
router.get('/blogs',getAllBlogs)
router.get('/blog/:blogId',getABlog)
router.put('/blog/update/:userId/:blogId',updateBlog)
router.delete('/blog/remove/:userId/:blogId',removeImage,popBlogFromUser)


module.exports = router