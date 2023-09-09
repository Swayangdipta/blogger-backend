const router = require('express').Router()

const { getReportById, getReport, getAllReports, createReport, updateReport } = require('../controllers/report')
const {getUserById} = require('../controllers/user')

router.param('reportId',getReportById)
router.param('userId',getUserById)

router.get('/report/:reportId',getReport)
router.get('/report/all',getAllReports)

router.post('/report/:userId',createReport)
router.put('/report/:reportId/:userId',updateReport)

module.exports = router