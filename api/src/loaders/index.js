import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import Logger from './logger.js';

export default async ({ expressApp }) => {
  await sequelizeLoader.newConnection();
  Logger.info('> Database loaded');

  await expressLoader({ app: expressApp });
  Logger.info('> Express loaded');

  // rest of loaders...
};