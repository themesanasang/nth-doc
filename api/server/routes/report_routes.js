'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    getSumDataBoxDashboard,
    getDataDocSummary
} = require('../controllers/report_controller')


router.route('/v1/report/getSumDataBoxDashboard').get(verifyToken, getSumDataBoxDashboard)  
router.route('/v1/report/getDataDocSummary/:doctype/:date1/:date2').get(verifyToken, getDataDocSummary)  
 

module.exports = router