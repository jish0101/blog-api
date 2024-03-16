import handler from 'express-async-handler';
import config from '../Utils/config.js';
import jwt from 'jsonwebtoken';

export const verifyAuth = handler(async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader) {
    res.status(403);
    throw new Error('Unauthorised');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(403);
    throw new Error('Unauthorised');
  }

  return jwt.verify(token, config.ACCESSTOKENSEC, (err, decoded) => {
    if (err) {
      res.status(403);
      throw new Error('Unauthorised');
    }
    req.user = decoded;
    return next();
  });
});
