'use strict'

const jwt_decode = require('jwt-decode');
const CryptoJS = require('crypto-js');
import { User } from '../models';
import helpers from '../helpers/util';

const {
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



module.exports = {
    loginUser,
    getUserMe
}  