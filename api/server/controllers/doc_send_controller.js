'use strict'

const CryptoJS = require('crypto-js');
import dateFormat from 'dateformat';
import { DocSend } from '../models';
import helpers from '../helpers/util';

const {
  errorResponse
} = helpers;


/**
  * @description -This method registers a doc send
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc send from the method
  * @returns {object} - data
  */
 const postDocSend = async (req, res) => {
  let { 
    book_number,
    date_send,
    time_send,
    agency,
    receiver,
    book_name,
    book_date,
    note,
    group,
    created_by
  } = req.body;  

  try {
      let max;
      let idmax = await DocSend.getIDMax();
      if(idmax === null || idmax === '' || typeof idmax === 'undefined') {
        max = '0001';
      } else {
        max = idmax['idmax'];
      }

      let year_now = dateFormat(new Date(), "yyyy")
      year_now = (parseInt(year_now) + 543)
      let id = ''; 
      
      let yearmax = await DocSend.getIDYearMax(); 
      if(yearmax === null || yearmax === '' || typeof yearmax === 'undefined'){
        id = year_now.toString().substr(2)+'0001';
      } else {
        if(yearmax['yearmax'] !== year_now.toString().substr(2)) {
          id = year_now.toString().substr(2)+'0001';
        } else {
          let mm = (parseInt(max)+1);

          if(String(mm).length === 1){
            mm = '000'+mm;
          }else if(String(mm).length === 2) {
            mm = '00'+mm;
          }else if(String(mm).length === 3) {
            mm = '0'+mm;
          }

          if(yearmax['yearmax'] !== year_now.toString().substr(2)) {
            id = year_now.toString().substr(2)+'0001';
          } else {
            id = yearmax['yearmax']+''+mm;
          }
        }
      }

      let created_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      let data = await DocSend.create({
        id,
        book_number,
        date_send,
        time_send,
        agency,
        receiver,
        book_name,
        book_date,
        note,
        group,
        created_by,
        created_at,
        updated_at
      });

      return res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error'+error });
  }
}




/**
  * @description -This method returns detail of  Doc Send all
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent back from the method
  * @returns {object} - Doc Send all
  */
const getDocSendAll = async (req, res) => {
  try {
    const doc = await DocSend.findAll();
    if (!doc) {
      return errorResponse(res, 404, 'doc_04', 'doc does not exist.');
    }
    return res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error'+error });
  }
}



/**
  * @description -This method get doc Send detail
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc Send from the controller
  * @returns {object} - doc Send detail
  */
 const getDocSend = async (req, res) => {
  try {
    const { send_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(send_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    if (!id) {
      errorResponse(res, 400, 'send_01', 'id is required', 'id');
    }

    if (isNaN(id)) return errorResponse(res, 400, 'send_01', 'id must be a number', 'id');
    
    const data = await DocSend.findOne(id);

    if (data == '') {
      return errorResponse(res, 404, 'send_04', 'send does not exist.');
    }

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



/**
  * @description -This method updates a doc Send's personal details
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - doc Send
  */
 const updateDocSend = async (req, res) => {
  try {
      const { send_id } = req.params;

      let bytes = CryptoJS.AES.decrypt(send_id, process.env.SECRET_KEY);
      let id = bytes.toString(CryptoJS.enc.Utf8);

      let { 
        book_number,
        date_send,
        time_send,
        agency,
        receiver,
        book_name,
        book_date,
        note,
        group,
        created_by
      } = req.body;  

      let existingDocSend =  await DocSend.countById(id);
      if (existingDocSend['numrow'] == 0){
        return errorResponse(res, 404, 'send_04', 'doc send does not exist.'); 
      }  
    
      let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");  

      let data = await DocSend.update(id, {
        book_number,
        date_send,
        time_send,
        agency,
        receiver,
        book_name,
        book_date,
        note,
        group,
        created_by,
        updated_at
      });

      return res.status(200).json(data); 
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}



/**
  * @description -This method removes doc Send
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc Send from the controller
  * @returns {array} - removes doc Send
  */
 const deleteDocSend = async (req, res) => {
  try {
    const { send_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(send_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    let existingDocSend =  await DocSend.countById(id);
    if (existingDocSend['numrow'] == 0){
      return errorResponse(res, 404, 'send_01', 'No send found', 'id'); 
    }  

    await DocSend.destroy(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
    postDocSend,
    getDocSendAll,
    getDocSend,
    updateDocSend,
    deleteDocSend
}