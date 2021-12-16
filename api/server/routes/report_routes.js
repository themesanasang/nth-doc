'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    getSumDataBoxDashboard
} = require('../controllers/report_controller')


router.route('/v1/report/getSumDataBoxDashboard').get(verifyToken, getSumDataBoxDashboard)  
  

module.exports = router