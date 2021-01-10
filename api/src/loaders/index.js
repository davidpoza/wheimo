import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import diLoader from './di.js';
import Logger from './logger.js';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  Logger.info('> Database loaded');

  diLoader({ sequelize });
  Logger.info('> Dependency injection loaded');

  await expressLoader({ app: expressApp });
  Logger.info('> Express loaded');

  // rest of loaders...
};