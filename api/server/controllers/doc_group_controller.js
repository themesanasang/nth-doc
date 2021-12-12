'use strict'

const CryptoJS = require('crypto-js');
import { DocGroup } from '../models';
import helpers from '../helpers/util';

const {
  errorResponse
} = helpers;


/**
  * @description -This method registers a doc group
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc group from the method
  * @returns {object} - data
  */
const postDocGroup = async (req, res) => {
    let { 
        group
    } = req.body;  

  try {
        let existingGroup =  await DocGroup.countByGroup(group);
        if (existingGroup['numrow'] > 0){
          return errorResponse(res, 404, 'group_04', 'The group already exists'); 
        }  

      let data = await DocGroup.create({
        group
      });

      return res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}


/**
  * @description -This method returns detail of  doc group
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc group from the method
  * @returns {object} - doc group all
  */
 const getDocGroupAllOpen = async (req, res) => {
  try {
    const doc = await DocGroup.findAllOpen();
    if (!doc) {
      return errorResponse(res, 404, 'doc_04', 'doc does not exist.');
    }
    return res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


/**
  * @description -This method returns detail of  doc group
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc group from the method
  * @returns {object} - doc group all
  */
const getDocGroupAll = async (req, res) => {
  try {
    const doc = await DocGroup.findAll();
    if (!doc) {
      return errorResponse(res, 404, 'doc_04', 'doc does not exist.');
    }
    return res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method get doc group detail
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc group from the controller
  * @returns {object} - doc group detail
  */
const getDocGroup = async (req, res) => {
  try {
    const { group_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(group_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    if (!id) {
      errorResponse(res, 400, 'group_01', 'id is required', 'id');
    }

    if (isNaN(id)) return errorResponse(res, 400, 'group_01', 'id must be a number', 'id');
    
    const doc_group = await DocGroup.findOne(id);

    if (doc_group == '') {
      return errorResponse(res, 404, 'group_04', 'doc_group does not exist.');
    }

    return res.status(200).json(doc_group);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method updates a doc group's personal details
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - doc group
  */
 const updateDocGroup = async (req, res) => {
    try {
        const { group_id } = req.params;

        let bytes = CryptoJS.AES.decrypt(group_id, process.env.SECRET_KEY);
        let id = bytes.toString(CryptoJS.enc.Utf8);

        let { 
            group,
            status
        } = req.body;  
  
        let existingDocGroup =  await DocGroup.countById(id);
        if (existingDocGroup['numrow'] == 0){
          return errorResponse(res, 404, 'group_04', 'doc group does not exist.'); 
        }  
      
        let doc_group =  await DocGroup.update(id, {
            group,
            status
        });

        return res.status(200).json(doc_group); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
  * @description -This method removes doc group
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc group from the controller
  * @returns {array} - removes doc group
  */
const deleteDocGroup = async (req, res) => {
  try {
    const { group_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(group_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    let existingDocGroup =  await DocGroup.countById(id);
    if (existingDocGroup['numrow'] == 0){
      return errorResponse(res, 404, 'group_01', 'No group found', 'id'); 
    }  

    let countWorkReceive = await DocGroup.countWorkReceive(id);
    let countWorkSend = await DocGroup.countWorkSend(id);

    if (countWorkReceive['numrow'] > 0 || countWorkSend['numrow'] > 0) {
      let status = 'N';
      await DocGroup.update(id, {
        status
      });
    } else {
      await DocGroup.destroy(id);
    }

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
    postDocGroup,
    getDocGroupAllOpen,
    getDocGroupAll,
    getDocGroup,
    updateDocGroup,
    deleteDocGroup
}