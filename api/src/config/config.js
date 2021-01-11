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
    dbname: 'wheimo',
    username: 'user', // not used on sqlite
    password: 'password',// not used on sqlite
    params: {
      dialect: 'sqlite',
      storage: './database.sqlite',
      define: {
        underscored: true
      },
      operatorsAliases: false
    }
  },
  api: {
    prefix: '/',
  },
  language: 'es',
  currency: 'eur',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10),
  jwtLifetime: parseInt(process.env.JWT_LIFETIME, 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGORITHM,
};

