'use strict'

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





module.exports = {
    getSumDataBoxDashboard
}