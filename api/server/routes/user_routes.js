'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
  loginUser,
  getUserMe,
  postUser,
  getUserAll,
  getUser,
  updateUser,
  disableUser,
  deleteUser
} = require('../controllers/user_controller')

router.route('/v1/login').post(loginUser)
router.route('/v1/user/me').get(verifyToken, getUserMe)

router.route('/v1/user')
  .get(verifyToken, getUserAll)
  .post(verifyToken, postUser)

router.route('/v1/user/:user_id')
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser)

router.route('/v1/user/disable/:user_id').put(verifyToken, disableUser)

module.exports = router