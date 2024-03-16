import { validationResult } from 'express-validator';
import expressAsyncHandler from 'express-async-handler';

export const schemaValidator = expressAsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    req.errors = errors.array();
    throw Error('Validation Error');
  }
  next();
});
