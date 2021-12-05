'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    postDocReceiver,
    getDocReceiverAll,
    getDocReceiver,
    updateDocReceiver,
    deleteDocReceiver
} = require('../controllers/doc_receiver_controller')

router.route('/v1/doc/receiver')
  .get(getDocReceiverAll)
  .post(verifyToken, postDocReceiver)
  
router.route('/v1/doc/receiver/:receiver_id')
  .get(verifyToken, getDocReceiver)
  .put(verifyToken, updateDocReceiver)
  .delete(verifyToken, deleteDocReceiver)

module.exports = router