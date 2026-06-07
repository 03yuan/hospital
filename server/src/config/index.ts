import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const databaseUrl = process.env.DATABASE_URL;

if (!jwtSecret) {
  throw new Error('JWT_SECRET 环境变量未设置');
}
if (!databaseUrl) {
  throw new Error('DATABASE_URL 环境变量未设置');
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret,
  databaseUrl,
};
