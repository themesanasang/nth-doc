'use strict'

const jwt_decode = require('jwt-decode');
const CryptoJS = require('crypto-js');
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
    const { username, password } = req.body;
    try {
        
        const existingUser = await User.countByUsernamePassword(username, password);
        if(existingUser['numrow'] > 0){
            const dataUser = await User.findByUsernamePassword(username, password);

            const user = dataUser;
            const token = await createToken(user);
            
            res.status(200).json({
                user,
                token: token,
                expires_in: process.env.JWT_EXPIRATION
            });
            
        }else{
            return errorResponse(res, 400, 'USR_01', 'data is invalid. user');
        }
       


        /*let bytes = CryptoTS.AES.decrypt(cid, process.env.secret_key);
        let id = bytes.toString(CryptoTS.enc.Utf8);

        let bytes2 = CryptoTS.AES.decrypt(birthday, process.env.secret_key);
        let id2 = bytes2.toString(CryptoTS.enc.Utf8);

        const existingUser = await User.findByCID(id, id2);
    
        if (existingUser != '') {
            existingUser[0].hn = CryptoTS.AES.encrypt(String(existingUser[0].hn), process.env.secret_key);
            existingUser[0].fullname = CryptoTS.AES.encrypt(String(existingUser[0].fullname), process.env.secret_key);

            const user = existingUser;
            const token = await createToken(user);
            
            res.status(200).json({
                accessToken: token,
                user,
                expires_in: process.env.JWT_EXPIRATION
            });
        } else {
            return errorResponse(res, 400, 'USR_01', 'cid is invalid.');
        }*/
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
        res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error'+error });
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
  
      if (isNaN(uuid)) return errorResponse(res, 400, 'user_01', 'id must be a number', 'id');
      
      const data = await User.findOne(uuid);
  
      if (data == '') {
        return errorResponse(res, 404, 'user_04', 'user does not exist.');
      }
  
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error'+error });
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
            username,
            password,
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
            username,
            password,
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



module.exports = {
    loginUser,
    getUserMe,
    postUser,
    getUserAll,
    getUser,
    updateUser
}  