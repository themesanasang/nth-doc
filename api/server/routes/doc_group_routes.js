'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    postDocGroup,
    getDocGroupAll,
    getDocGroupAllOpen,
    getDocGroup,
    updateDocGroup,
    deleteDocGroup
} = require('../controllers/doc_group_controller')

router.route('/v1/doc/group')
  .get(verifyToken, getDocGroupAll)
  .post(verifyToken, postDocGroup)

router.route('/v1/doc/group/open').get(verifyToken, getDocGroupAllOpen)
  
router.route('/v1/doc/group/:group_id')
  .get(verifyToken, getDocGroup)
  .put(verifyToken, updateDocGroup)
  .delete(verifyToken, deleteDocGroup)

module.exports = router