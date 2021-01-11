import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import diLoader from './di.js';
import logger from './logger.js';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  logger.info('> Database loaded');

  diLoader({ sequelize, logger });
  logger.info('> Dependency injection loaded');

  await expressLoader({ app: expressApp });
  logger.info('> Express loaded');

  // rest of loaders...
};