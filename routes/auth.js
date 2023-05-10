const router = require('express').Router()
const { register, login, getResetPasswordURL,resetPassword } = require('../controllers/auth')

router.post('/auth/register',register)
router.post('/auth/login',login)
router.post('/auth/forget',getResetPasswordURL)
router.post('/auth/reset',resetPassword)

module.exports = router