import dotenv from 'dotenv';
const envFound = dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file");
}

export default {
  port: parseInt(process.env.PORT, 10),
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  db: {
    params: {
      dialect: 'sqlite',
      storage: 'wheimo.sqlite',
      define: {
        underscored: true
      },
      operatorsAliases: false
    }
  },
  api: {
    prefix: '/',
  }
};

