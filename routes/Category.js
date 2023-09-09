const router = require('express').Router()
const { getCategoryById, getCategory, getAllCategories, createCategory } = require('../controllers/Category')

router.param('categoryId',getCategoryById)

router.get('/category/:categoryId',getCategory)
router.get('/categories',getAllCategories)
router.post('/category/create',createCategory)

module.exports = router