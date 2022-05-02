'use strict'

const CryptoJS = require('crypto-js');
import { DocReport } from '../models';
import helpers from '../helpers/util';

const {
  errorResponse
} = helpers;


/**
  * @description -This method returns sum data
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent sum data from the method
  * @returns {object} - sum data
  */
const getSumDataBoxDashboard = async (req, res) => {
  try {
    const data1 = await DocReport.getSumReceiveDay();
    const data2 = await DocReport.getSumReceiveMonth();
    const data3 = await DocReport.getSumReceiveYear();
    const data4 = await DocReport.getSumSendDay();
    const data5 = await DocReport.getSumSendMonth();
    const data6 = await DocReport.getSumSendYear();
    
    let result = {
        receiveDay: data1[0],
        receiveMonth: data2[0],
        receiveYear: data3[0],
        sendDay: data4[0],
        sendMonth: data5[0],
        sendYear: data6[0]
    }

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


/**
  * @description -This method get doc summary
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc summary from the controller
  * @returns {object} - doc summary detail
  */
 const getDataDocSummary = async (req, res) => {
  try {
    const { doctype, date1, date2 } = req.params;

    let bytes = CryptoJS.AES.decrypt(doctype, process.env.SECRET_KEY);
    let type = bytes.toString(CryptoJS.enc.Utf8);

    if (!type) {
      errorResponse(res, 400, 'type_01', 'type is required', 'id');
    }

    let data = '';

    if(type == 'receive') {
      data = await DocReport.findDataReceive(date1, date2);
    } else {
      data = await DocReport.findDataSend(date1, date2);
    }

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


/**
  * @description -This method get doc month summary
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc summary from the controller
  * @returns {object} - doc month summary detail
  */
 const getDataDocMonthSummary = async (req, res) => {
  try {
    const { doctype, year } = req.params;

    let bytes = CryptoJS.AES.decrypt(doctype, process.env.SECRET_KEY);
    let type = bytes.toString(CryptoJS.enc.Utf8);

    let bytes2 = CryptoJS.AES.decrypt(year, process.env.SECRET_KEY);
    let year2 = bytes2.toString(CryptoJS.enc.Utf8);

    if (!type) {
      errorResponse(res, 400, 'type_01', 'type is required', 'id');
    }

    let data = '';

    if(type == 'receive') {
      data = await DocReport.findDataReceiveMonth(year2);
    } else {
      data = await DocReport.findDataSendMonth(year2);
    }

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports = {
  getSumDataBoxDashboard,
  getDataDocSummary,
  getDataDocMonthSummary
}