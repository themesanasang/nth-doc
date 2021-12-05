'use strict'

const router = require('express').Router()
const verifyToken = require('../middleware/verify_token');
const {
    postDocDepartment,
    getDocDepartmentAllOpen,
    getDocDepartmentAll,
    getDocDepartment,
    updateDocDepartment,
    deleteDocDepartment
} = require('../controllers/department_controller')

router.route('/v1/department')
  .get(verifyToken, getDocDepartmentAll)
  .post(verifyToken, postDocDepartment)
  
router.route('/v1/department/open').get(verifyToken, getDocDepartmentAllOpen)

router.route('/v1/department/:dep_id')
  .get(verifyToken, getDocDepartment)
  .put(verifyToken, updateDocDepartment)
  .delete(verifyToken, deleteDocDepartment)

module.exports = router