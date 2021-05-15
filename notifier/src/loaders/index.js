import dayjs from 'dayjs';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';

//import es from 'dayjs/locale/es'
dayjs.locale('es')
import Queue from './queue.js';
import expressLoader from './express.js';
import diLoader from './di.js';
import logger from './logger.js';


export default async ({ expressApp }) => {

  diLoader({
    logger,
    Queue,
    lowdb,
    FileSync
    //<-- add scheduler as last dependency
  });
  logger.info('🟢 Dependency injection loaded');

  await expressLoader({ app: expressApp });
  logger.info('🟢 Express loaded');

  // rest of loaders...
};