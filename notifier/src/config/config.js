import dotenv from 'dotenv';
const envFound = dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file");
}

export default {
  port: parseInt(process.env.PORT, 10),
  debug: process.env.DEBUG === 'true',
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  lowdb: 'subs-db.json',
  notificationsQueue: 'savingNotifications',
  privateVapidKey: process.env.PRIVATE_VAPID_KEY
};

