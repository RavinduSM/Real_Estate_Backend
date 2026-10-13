import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV ?? 'development'}`),
});

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    name: process.env.DB_NAME ?? 'real_estate',
    user: process.env.DB_USER ?? 'root',
    pass: process.env.DB_PASS ?? '',
    port: Number(process.env.DB_PORT ?? 3306),
  },
};
