'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
  loginUser,
  getUserMe
} = require('../controllers/user_controller')

router.route('/v1/login').post(loginUser)
router.route('/v1/user/me').get(verifyToken, getUserMe)

module.exports = router