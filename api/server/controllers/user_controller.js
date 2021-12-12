'use strict'

const jwt_decode = require('jwt-decode');
const CryptoJS = require('crypto-js');
import dateFormat from 'dateformat';
const { v4: uuidv4 } = require('uuid');
import { User } from '../models';
import helpers from '../helpers/util';

const {
    hashPassword,
    comparePasswords,
    createToken,
    errorResponse
} = helpers;


/**
  * @description -This method logins a user
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent back from the method
  * @returns {object} - user and accessToken
  */
 const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        let bytes = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY);
        let password_post = bytes.toString(CryptoJS.enc.Utf8);

        const dataUser = await User.findByUsername(username);
        const match = await comparePasswords(password_post, dataUser[0].password);
        
        if(match) {
            const user = dataUser[0];
            const token = await createToken(user);
            
            res.status(200).json({
                user,
                token: token,
                expires_in: process.env.JWT_EXPIRATION
            });
            
        }else{
            return errorResponse(res, 400, 'USR_01', 'data is invalid. user');
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



const getUserMe = async (req, res) => {
    try {
        const headers = req.headers.authorization
        const token = headers && headers.split(' ')[1] // Bearer <TOKEN>
        var decoded = jwt_decode(token);

        res.status(200).json({
            user: {
                uid: decoded.uid,
                username: decoded.username
            },
        });

    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


/**
  * @description -This method registers a user
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent back from the method
  * @returns {object} - user_id
  */
const postUser = async (req, res) => {
    let { 
        username,
        password,
        firstname,
        lastname,
        email,
        line_id,
        department,
        status 
    } = req.body;  
  
    try {
        
        let existingUser =  await User.countByUsername(username);
        if (existingUser['numrow'] > 0){
            return errorResponse(res, 409, 'USR_04', 'The username already exists.', 'username'); 
        }  
        
        let created_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        let hashedPassword =  await hashPassword(password);
        let uuid = uuidv4();

        let user =  await User.create({
            uuid,
            username,
            password: hashedPassword,
            firstname,
            lastname,
            email,
            line_id,
            department,
            status,
            created_at,
            updated_at
        });

        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'+error });
    }
}


/**
  * @description -This method returns detail of user all
  * @param {object} req - The request payload
  * @param {object} res - The response payload sent back from the method
  * @returns {object} - user all
  */
const getUserAll = async (req, res) => {
    try {
      const data = await User.findAll();
      if (!data) {
        return errorResponse(res, 404, 'user_04', 'user does not exist.');
      }
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}



/**
  * @description -This method get doc User detail
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent User from the controller
  * @returns {object} - User detail
  */
const getUser = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      let bytes = CryptoJS.AES.decrypt(user_id, process.env.SECRET_KEY);
      let uuid = bytes.toString(CryptoJS.enc.Utf8);
  
      if (!uuid) {
        errorResponse(res, 400, 'user_01', 'id is required', 'id');
      }

      const data = await User.findOne(uuid);
  
      if (data == '') {
        return errorResponse(res, 404, 'user_04', 'user does not exist.');
      }
  
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


/**
  * @description -This method updates a User's personal details
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - User
  */
const updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;
  
        let bytes = CryptoJS.AES.decrypt(user_id, process.env.SECRET_KEY);
        let uuid = bytes.toString(CryptoJS.enc.Utf8);
  
        let { 
            firstname,
            lastname,
            email,
            line_id,
            department,
            status 
        } = req.body;  
  
        let existingUser =  await User.countByUUID(uuid);
        if (existingUser['numrow'] == 0){
          return errorResponse(res, 404, 'user_04', 'user does not exist.'); 
        }  
      
        let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");  
  
        let data = await User.update(uuid, {
            firstname,
            lastname,
            email,
            line_id,
            department,
            status, 
            updated_at
        });
  
        return res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


/**
  * @description -This method updates a User
  * @param {object} req - The request payload
  * @param {object} res - The response payload
  * @returns {object} - User
  */
 const disableUser = async (req, res) => {
  try {
      const { user_id } = req.params;

      let bytes = CryptoJS.AES.decrypt(user_id, process.env.SECRET_KEY);
      let uuid = bytes.toString(CryptoJS.enc.Utf8);

      let existingUser =  await User.countByUUID(uuid);
      if (existingUser['numrow'] == 0){
        return errorResponse(res, 404, 'user_04', 'user does not exist.'); 
      }  
    
      let status = 'N';
      let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");  

      let data = await User.update(uuid, {
          status, 
          updated_at
      });

      return res.status(200).json(data); 
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
}


/**
  * @description -This method removes user
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent user from the controller
  * @returns {array} - removes user
  */
 const deleteUser = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      let bytes = CryptoJS.AES.decrypt(user_id, process.env.SECRET_KEY);
      let uuid = bytes.toString(CryptoJS.enc.Utf8);
  
      let existingUser =  await User.countByUUID(uuid);
      if (existingUser['numrow'] == 0){
        return errorResponse(res, 404, 'user_01', 'No user found', 'id'); 
      }  

      let countWorkReceive = await User.countWorkReceive(uuid);
      let countWorkSend = await User.countWorkSend(uuid);

      if (countWorkReceive['numrow'] > 0 || countWorkSend['numrow'] > 0) {
        let status = 'N';
        let updated_at = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");  

        await User.update(uuid, {
            status, 
            updated_at
        });
      } else {
        await User.destroy(uuid);
      }
  
      return res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


module.exports = {
    loginUser,
    getUserMe,
    postUser,
    getUserAll,
    getUser,
    updateUser,
    disableUser,
    deleteUser
}  