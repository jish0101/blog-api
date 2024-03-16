import { allowedOrigins } from '../Config/corsConfig.js';

export const credentials = (req, res, next) => {
  try {
    const { origin } = req.headers;
    if (allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Credentials', 'true');
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
