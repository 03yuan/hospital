import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  databaseUrl: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/hospital',
};
