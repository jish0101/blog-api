import { query } from 'express-validator';

export const userIdSchema = [query('id').isMongoId()];
