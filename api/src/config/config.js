import dotenv from 'dotenv';
const envFound = dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file");
}

export default {
  port: 3000,
  url: process.env.URL,
  debug: process.env.DEBUG === 'true',
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  db: {
    dbname: 'wheimo',
    username: 'user', // not used on sqlite
    password: 'password',// not used on sqlite
    params: {
      dialect: 'sqlite',
      storage: './data/db/database.sqlite',
      define: {
        underscored: true
      },
    }
  },
  uploadDir: './data/images',
  uploadMaxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 10,
  uploadMaxResolution: parseInt(process.env.UPLOAD_MAX_RESOLUTION, 10) || 1920,
  api: {
    prefix: '/',
  },
  language: 'es',
  currency: 'eur',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  jwtLifetime: parseInt(process.env.JWT_LIFETIME, 10) || 86400,
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
  aesPassphrase: process.env.AES_PASSPHRASE,
  resyncFrequency: process.env.RESYNC_FREQ || 10,
  notificationsQueue: 'savingNotifications',
  privateVapidKey: process.env.PRIVATE_VAPID_KEY
};

