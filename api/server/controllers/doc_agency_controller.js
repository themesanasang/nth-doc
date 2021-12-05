'use strict'

const CryptoJS = require('crypto-js');
import { DocAgency } from '../models';
import helpers from '../helpers/util';

const {
  errorResponse
} = helpers;


/**
  * @description -This method registers a doc agency
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc agency from the method
  * @returns {object} - data
  */
const postDocAgency = async (req, res) => {
    let { 
        agency
    } = req.body;  

  try {
        let existingAgency =  await DocAgency.countByAgency(agency);
        if (existingAgency['numrow'] > 0){
          return errorResponse(res, 404, 'agency_04', 'The agency already exists'); 
        }  

      let data = await DocAgency.create({
        agency
      });

      return res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method returns detail of  doc agency
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc agency from the method
  * @returns {object} - doc agency all
  */
const getDocAgencyAll = async (req, res) => {
  try {
    const agency = await DocAgency.findAll();
    if (!agency) {
      return errorResponse(res, 404, 'agency_04', 'agency does not exist.');
    }
    return res.status(200).json(agency);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method get doc agency detail
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc agency from the controller
  * @returns {object} - doc agency detail
  */
const getDocAgency = async (req, res) => {
  try {
    const { agency_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(agency_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    if (!id) {
      errorResponse(res, 400, 'agency_01', 'id is required', 'id');
    }

    if (isNaN(id)) return errorResponse(res, 400, 'agency_01', 'id must be a number', 'id');
    
    const agency = await DocAgency.findOne(id);

    if (agency == '') {
      return errorResponse(res, 404, 'agency_04', 'agency does not exist.');
    }

    return res.status(200).json(agency);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method updates a doc agency's personal details
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - doc agency
  */
 const updateDocAgency = async (req, res) => {
    try {
        const { agency_id } = req.params;

        let bytes = CryptoJS.AES.decrypt(agency_id, process.env.SECRET_KEY);
        let id = bytes.toString(CryptoJS.enc.Utf8);

        let { 
            agency
        } = req.body;  
  
        let existingDocAgency =  await DocAgency.countById(id);
        if (existingDocAgency['numrow'] == 0){
          return errorResponse(res, 404, 'agency_04', 'doc agency does not exist.'); 
        }  
      
        let doc_agency =  await DocAgency.update(id, {
            agency
        });

        return res.status(200).json(doc_agency); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
  * @description -This method removes doc agency
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc agency from the controller
  * @returns {array} - removes doc agency
  */
const deleteDocAgency = async (req, res) => {
  try {
    const { agency_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(agency_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    let existingDocAgency =  await DocAgency.countById(id);
    if (existingDocAgency['numrow'] == 0){
      return errorResponse(res, 404, 'agency_01', 'No agency found', 'id'); 
    }  

    await DocAgency.destroy(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
    postDocAgency,
    getDocAgencyAll,
    getDocAgency,
    updateDocAgency,
    deleteDocAgency
}