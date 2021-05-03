import dayjs from 'dayjs';
import Queue from 'bee-queue';

//import es from 'dayjs/locale/es'
dayjs.locale('es')
import expressLoader from './express.js';
import diLoader from './di.js';
import logger from './logger.js';


export default async ({ expressApp }) => {

  diLoader({
    logger,
    Queue,
    //<-- add scheduler as last dependency
  });
  logger.info('🟢 Dependency injection loaded');

  await expressLoader({ app: expressApp });
  logger.info('🟢 Express loaded');

  // rest of loaders...
};