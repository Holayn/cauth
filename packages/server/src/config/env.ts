import dotenv from 'dotenv';

dotenv.config({ quiet: true });

if (!process.env.NOTIFY_SERVICE_URL && process.env.NODE_ENV !== 'development') {
  throw new Error('Notify service URL is not defined.');
}
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required');
}
if (!process.env.DATA_DIR) {
  throw new Error('DATA_DIR environment variable is required');
}
if (!process.env.API_TOKEN) {
  throw new Error('API_TOKEN environment variable is required');
}

if (process.env.NODE_ENV === 'development' && !process.env.WEB_DEV_PORT) {
  throw new Error('WEB_DEV_PORT environment variable is required in development');
}

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const DATA_DIR = process.env.DATA_DIR;
export const NOTIFY_SERVICE_URL = process.env.NOTIFY_SERVICE_URL;
export const WEB_DEV_PORT = process.env.WEB_DEV_PORT;
export const API_TOKEN = process.env.API_TOKEN;

export const isDevelopment = NODE_ENV === 'development';
