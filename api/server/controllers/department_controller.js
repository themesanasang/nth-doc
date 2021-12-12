'use strict'

const CryptoJS = require('crypto-js');
import { DocDepartment } from '../models';
import helpers from '../helpers/util';

const {
  errorResponse
} = helpers;

/**
  * @description -This method registers a doc department
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc department from the method
  * @returns {object} - data
  */
const postDocDepartment = async (req, res) => {
    let { 
        department,
        status
    } = req.body;  

  try {
        let existingDepartment =  await DocDepartment.countByDepartment(department);
        if (existingDepartment['numrow'] > 0){
          return errorResponse(res, 404, 'department_04', 'The department already exists'); 
        }  

      let data = await DocDepartment.create({
        department,
        status
      });

      return res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method returns detail of  doc department
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc department from the method
  * @returns {object} - doc department all
  */
const getDocDepartmentAllOpen = async (req, res) => {
  try {
    const data = await DocDepartment.findAllOpen();
    if (!data) {
      return errorResponse(res, 404, 'department_04', 'department does not exist.');
    }
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error'+error });
  }
}


/**
  * @description -This method returns detail of  doc department
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc department from the method
  * @returns {object} - doc department all
  */
 const getDocDepartmentAll = async (req, res) => {
    try {
      const data = await DocDepartment.findAll();
      if (!data) {
        return errorResponse(res, 404, 'department_04', 'department does not exist.');
      }
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

/**
  * @description -This method get doc department detail
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc department from the controller
  * @returns {object} - doc department detail
  */
const getDocDepartment = async (req, res) => {
  try {
    const { dep_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(dep_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    if (!id) {
      errorResponse(res, 400, 'department_01', 'id is required', 'id');
    }

    if (isNaN(id)) return errorResponse(res, 400, 'departmentp_01', 'id must be a number', 'id');
    
    const data = await DocDepartment.findOne(id);

    if (data == '') {
      return errorResponse(res, 404, 'department_04', 'department_group does not exist.');
    }

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method updates a doc department's personal details
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - doc department
  */
 const updateDocDepartment = async (req, res) => {
    try {
        const { dep_id } = req.params;

        let bytes = CryptoJS.AES.decrypt(dep_id, process.env.SECRET_KEY);
        let id = bytes.toString(CryptoJS.enc.Utf8);

        let { 
            department,
            status
        } = req.body;  
  
        let existingDocDepartment =  await DocDepartment.countById(id);
        if (existingDocDepartment['numrow'] == 0){
          return errorResponse(res, 404, 'department_04', 'doc department does not exist.'); 
        }  
      
        let data =  await DocDepartment.update(id, {
            department,
            status
        });

        return res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
  * @description -This method removes doc department
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc department from the controller
  * @returns {array} - removes doc department
  */
const deleteDocDepartment = async (req, res) => {
  try {
    const { dep_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(dep_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    let existingDocDepartment =  await DocDepartment.countById(id);
    if (existingDocDepartment['numrow'] == 0){
      return errorResponse(res, 404, 'department_01', 'No department found', 'id'); 
    }  

    await DocDepartment.destroy(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
    postDocDepartment,
    getDocDepartmentAllOpen,
    getDocDepartmentAll,
    getDocDepartment,
    updateDocDepartment,
    deleteDocDepartment
}