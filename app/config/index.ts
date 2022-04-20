/**
 * Config file
 */

import dotenv from 'dotenv';

dotenv.config();

export default {
  environment: process.env.NODE_ENV || 'local',
  db: process.env.DB,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  allowedOrigins: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:300 ',
    'http://localhost:3002',
    'http://localhost:4020',
  ],
};
