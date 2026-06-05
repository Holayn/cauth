import dotenv from 'dotenv';

dotenv.config({ quiet: true });

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required');
}
if (!process.env.DATA_DIR) {
  throw new Error('DATA_DIR environment variable is required');
}

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const DATA_DIR = process.env.DATA_DIR;

export const isDevelopment = NODE_ENV === 'development';
