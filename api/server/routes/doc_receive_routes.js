'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    postDocReceive,
    getDocReceiveAll,
    getDocReceive,
    updateDocReceive,
    deleteDocReceive
} = require('../controllers/doc_receive_controller')


router.route('/v1/doc/receive').post(verifyToken, postDocReceive)
router.route('/v1/doc/receive/list').get(getDocReceiveAll)

router.route('/v1/doc/receive/:receive_id')
  .get(verifyToken, getDocReceive)
  .put(verifyToken, updateDocReceive)
  .delete(verifyToken, deleteDocReceive)

module.exports = router