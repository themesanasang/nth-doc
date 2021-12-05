'use strict'

const CryptoJS = require('crypto-js');
import { DocReceiver } from '../models';
import helpers from '../helpers/util';

const {
  errorResponse
} = helpers;


/**
  * @description -This method registers a doc receiver
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc receiver from the method
  * @returns {object} - data
  */
const postDocReceiver = async (req, res) => {
    let { 
        receiver
    } = req.body;  

  try {
        let existingDocReceiver =  await DocReceiver.countByReceiver(receiver);
        if (existingDocReceiver['numrow'] > 0){
          return errorResponse(res, 404, 'receiver_04', 'The receiver already exists'); 
        }  

      let data = await DocReceiver.create({
        receiver
      });

      return res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method returns detail of  doc receiver
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc receiver from the method
  * @returns {object} - doc receiver all
  */
const getDocReceiverAll = async (req, res) => {
  try {
    const receiver = await DocReceiver.findAll();
    if (!receiver) {
      return errorResponse(res, 404, 'receiver_04', 'receiver does not exist.');
    }
    return res.status(200).json(receiver);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method get doc receiver detail
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc receiver from the controller
  * @returns {object} - doc receiver detail
  */
const getDocReceiver = async (req, res) => {
  try {
    const { receiver_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(receiver_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    if (!id) {
      errorResponse(res, 400, 'receiver_01', 'id is required', 'id');
    }

    if (isNaN(id)) return errorResponse(res, 400, 'receiver_01', 'id must be a number', 'id');
    
    const receiver = await DocReceiver.findOne(id);

    if (receiver == '') {
      return errorResponse(res, 404, 'receiver_04', 'receiver does not exist.');
    }

    return res.status(200).json(receiver);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
  * @description -This method updates a doc receiver's personal details
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - doc receiver
  */
 const updateDocReceiver = async (req, res) => {
    try {
        const { receiver_id } = req.params;

        let bytes = CryptoJS.AES.decrypt(receiver_id, process.env.SECRET_KEY);
        let id = bytes.toString(CryptoJS.enc.Utf8);

        let { 
            receiver
        } = req.body;  
  
        let existingDocReceiver =  await DocReceiver.countById(id);
        if (existingDocReceiver['numrow'] == 0){
          return errorResponse(res, 404, 'receiver_04', 'doc receiver does not exist.'); 
        }  
      
        let doc_receiver =  await DocReceiver.update(id, {
            receiver
        });

        return res.status(200).json(doc_receiver); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
  * @description -This method removes doc receiver
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc receiver from the controller
  * @returns {array} - removes doc receiver
  */
const deleteDocReceiver = async (req, res) => {
  try {
    const { receiver_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(receiver_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    let existingDocReceiver =  await DocReceiver.countById(id);
    if (existingDocReceiver['numrow'] == 0){
      return errorResponse(res, 404, 'receiver_01', 'No receiver found', 'id'); 
    }  

    await DocReceiver.destroy(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
    postDocReceiver,
    getDocReceiverAll,
    getDocReceiver,
    updateDocReceiver,
    deleteDocReceiver
}