'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    postDocAgency,
    getDocAgencyAll,
    getDocAgency,
    getDocAgencyAllOpen,
    updateDocAgency,
    deleteDocAgency
} = require('../controllers/doc_agency_controller')

router.route('/v1/doc/agency')
  .get(verifyToken, getDocAgencyAll)
  .post(verifyToken, postDocAgency)

router.route('/v1/doc/agency/open').get(verifyToken, getDocAgencyAllOpen)
  
router.route('/v1/doc/agency/:agency_id')
  .get(verifyToken, getDocAgency)
  .put(verifyToken, updateDocAgency)
  .delete(verifyToken, deleteDocAgency)

module.exports = router