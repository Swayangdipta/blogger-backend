const router = require('express').Router()
const { getCategoryById, pushIntoCategory, popFromCategory } = require('../controllers/Category')
const { isSignedIn,isAuthenticated } = require('../controllers/auth')
const { createBlog, getBlogById, getAllBlogs, getABlog, updateBlog, removeImage, updateBlogLike, increaseViews, searchBlog, getBlogComments, addComment, getBlogsCount } = require('../controllers/blog')
const { getUserById, pushBlogToUser, popBlogFromUser, likeAndDislikeBlog } = require('../controllers/user')

router.param('userId',getUserById)
router.param('blogId',getBlogById)
router.param('categoryId',getCategoryById)

router.get('/blogs',getAllBlogs)
router.get('/blog/:blogId',getABlog)
router.get('/blogs/count',getBlogsCount)
router.get('/blog/view/increase/:blogId',increaseViews)
router.get('/blog/comments/:blogId',getBlogComments)

router.post('/blogs/like/:blogId/:userId',likeAndDislikeBlog,updateBlogLike)
router.post('/blog/create/:userId',createBlog,pushBlogToUser,pushIntoCategory)
router.post('/blog/s',searchBlog)
router.post('/blog/comment/add/:blogId/:userId',isSignedIn,addComment)

router.put('/blog/update/:userId/:blogId',updateBlog)
router.delete('/blog/remove/:userId/:blogId/:categoryId',popFromCategory,removeImage,popBlogFromUser)


module.exports = router