const router = require('express').Router()
const { register, login,logout, getResetPasswordURL,resetPassword } = require('../controllers/auth')

router.post('/auth/register',register)
router.post('/auth/login',login)
router.get('/auth/logout',logout)
router.post('/auth/forget',getResetPasswordURL)
router.post('/auth/reset',resetPassword)

module.exports = router