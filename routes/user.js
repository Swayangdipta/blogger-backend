const router = require('express').Router()
const { getUserById,getLikedBlogs } = require('../controllers/user')

router.param('userId',getUserById)

router.get('/user/likes/:userId',getLikedBlogs)

module.exports = router