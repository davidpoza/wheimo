import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import diLoader from './di.js';
import logger from './logger.js';
import AuthService from '../services/auth.js';
import UserService from '../services/user.js';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  logger.info('> Database loaded');

  diLoader({
    sequelize,
    logger,
    AuthService,
    UserService
  });
  logger.info('> Dependency injection loaded');

  await expressLoader({ app: expressApp });
  logger.info('> Express loaded');

  // rest of loaders...
};