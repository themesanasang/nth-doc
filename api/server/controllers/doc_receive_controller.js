'use strict'

const CryptoJS = require('crypto-js');
import dateFormat from 'dateformat';
import { DocReceive } from '../models';
import helpers from '../helpers/util';

const {
  errorResponse
} = helpers;




/**
  * @description -This method registers a doc receive
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent doc receive from the method
  * @returns {object} - data
  */
 const postDocReceive = async (req, res) => {
  let { 
    book_number,
    date_receive,
    time_receive,
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
      let idmax = await DocReceive.getIDMax();
      if(idmax === null || idmax === '' || typeof idmax === 'undefined') {
        max = '0001';
      } else {
        max = idmax['idmax'];
      }

      let year_now = dateFormat(new Date(), "yyyy")
      year_now = (parseInt(year_now) + 543)
      let id = ''; 
      let yearmax = await DocReceive.getIDYearMax(); 

      if(yearmax === null || yearmax === '' || typeof yearmax === 'undefined'){
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

      let created_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      let data = await DocReceive.create({
        id,
        book_number,
        date_receive,
        time_receive,
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
      res.status(500).json({ error: 'Internal Server Error' });
  }
}




/**
  * @description -This method returns detail of  Doc Receive all
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent back from the method
  * @returns {object} - Doc Receive all
  */
const getDocReceiveAll = async (req, res) => {
  try {
    const doc = await DocReceive.findAll();
    if (!doc) {
      return errorResponse(res, 404, 'doc_04', 'doc does not exist.');
    }
    return res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



/**
  * @description -This method get doc Receive detail
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc Receive from the controller
  * @returns {object} - doc Receive detail
  */
 const getDocReceive = async (req, res) => {
  try {
    const { receive_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(receive_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    if (!id) {
      errorResponse(res, 400, 'receive_01', 'id is required', 'id');
    }

    if (isNaN(id)) return errorResponse(res, 400, 'receive_01', 'id must be a number', 'id');
    
    const data = await DocReceive.findOne(id);

    if (data == '') {
      return errorResponse(res, 404, 'receive_04', 'receive does not exist.');
    }

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



/**
  * @description -This method updates a doc Receive's personal details
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - doc Receive
  */
 const updateDocReceive = async (req, res) => {
  try {
      const { receive_id } = req.params;

      let bytes = CryptoJS.AES.decrypt(receive_id, process.env.SECRET_KEY);
      let id = bytes.toString(CryptoJS.enc.Utf8);

      let { 
        book_number,
        date_receive,
        time_receive,
        agency,
        receiver,
        book_name,
        book_date,
        note,
        group,
        created_by
      } = req.body;  

      let existingDocReceive =  await DocReceive.countById(id);
      if (existingDocReceive['numrow'] == 0){
        return errorResponse(res, 404, 'receive_04', 'doc receive does not exist.'); 
      }  
    
      let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");  

      let data = await DocReceive.update(id, {
        book_number,
        date_receive,
        time_receive,
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
  * @description -This method removes doc Receive
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent doc Receive from the controller
  * @returns {array} - removes doc Receive
  */
 const deleteDocReceive = async (req, res) => {
  try {
    const { receive_id } = req.params;

    let bytes = CryptoJS.AES.decrypt(receive_id, process.env.SECRET_KEY);
    let id = bytes.toString(CryptoJS.enc.Utf8);

    let existingDocReceive =  await DocReceive.countById(id);
    if (existingDocReceive['numrow'] == 0){
      return errorResponse(res, 404, 'receive_01', 'No receive found', 'id'); 
    }  

    await DocReceive.destroy(id);

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  postDocReceive,
  getDocReceiveAll,
  getDocReceive,
  updateDocReceive,
  deleteDocReceive
}