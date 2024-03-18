import { body } from 'express-validator';

export const postCreateValidation = [body('image').optional()];
