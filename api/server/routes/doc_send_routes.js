'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    postDocSend,
    getDocSendAll,
    getDocSend,
    updateDocSend,
    deleteDocSend
} = require('../controllers/doc_send_controller')


router.route('/v1/doc/send').post(verifyToken, postDocSend)
router.route('/v1/doc/send/list').get(getDocSendAll)

router.route('/v1/doc/send/:send_id')
  .get(verifyToken, getDocSend)
  .put(verifyToken, updateDocSend)
  .delete(verifyToken, deleteDocSend)

module.exports = router