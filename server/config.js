import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === 'production';

export const config = {
  port: process.env.PORT || 3001,
  dataDir: isProd ? '/data' : join(__dirname, '..', 'data'),
  chaptersFile: isProd ? '/data/chapters.json' : join(__dirname, '..', 'data', 'chapters.json'),
  lessonsDir: isProd ? '/data/lessons' : join(__dirname, '..', 'data', 'lessons'),
  usersFile: isProd ? '/data/users.json' : join(__dirname, '..', 'data', 'users.json'),
  chunkSize: 5 * 1024 * 1024, // 5MB
  corsOrigins: isProd 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
    : ['http://localhost:5173'],
};