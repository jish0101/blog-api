import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__filename = __filename;
global.__dirname = __dirname;

export const statusOptions = {
  active: 'active',
  inactive: 'inactive',
  deleted: 'deleted',
};

export const rolesOptions = {
  user: 'user',
  moderator: 'moderator',
  admin: 'admin',
};

export const OTP_TYPES = {
  'get-otp': 'get-otp',
  'email-verification': 'email-verification',
  'phone-verification': 'phone-verification',
  'password-reset': 'password-reset',
};
