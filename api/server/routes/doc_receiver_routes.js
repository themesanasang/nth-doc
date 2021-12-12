'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    postDocReceiver,
    getDocReceiverAll,
    getDocReceiverAllOpen,
    getDocReceiver,
    updateDocReceiver,
    deleteDocReceiver
} = require('../controllers/doc_receiver_controller')

router.route('/v1/doc/receiver')
  .get(verifyToken, getDocReceiverAll)
  .post(verifyToken, postDocReceiver)

router.route('/v1/doc/receiver/open').get(verifyToken, getDocReceiverAllOpen)
  
router.route('/v1/doc/receiver/:receiver_id')
  .get(verifyToken, getDocReceiver)
  .put(verifyToken, updateDocReceiver)
  .delete(verifyToken, deleteDocReceiver)

module.exports = router