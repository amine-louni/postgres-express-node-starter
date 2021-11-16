import { config } from 'dotenv'
config()

export const __prod__ = process.env.NODE_ENV === 'production';

// code erros
export const BAD_AUTH = 'bad_auth';
export const NOT_FOUND = 'not_found';
export const INVALID_TOKEN = 'invalid_token';
export const EXPIRED_TOKEN = 'expired_token';



