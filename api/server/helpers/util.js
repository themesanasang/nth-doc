import jwt from 'jsonwebtoken';

export default {
 
  createToken(user) {
    return jwt.sign({ uid: user[0].id, username: user[0].username, firstname: user[0].firstname }, process.env.JWT_ENCRYPTION, { expiresIn: process.env.JWT_EXPIRATION });
  },
  errorResponse(res, status, code, message, field) {
    return res.status(status).json({
      error: {
        status,
        code,
        message,
        field: field || ''
      }
    });
  }

};