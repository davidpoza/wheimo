import dayjs from 'dayjs';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';
import webpush from 'web-push';

//import es from 'dayjs/locale/es'
dayjs.locale('es')
import expressLoader from './express.js';
import diLoader from './di.js';
import QueueLoader from './queue.js';
import logger from './logger.js';


export default async ({ expressApp }) => {

  diLoader({
    logger,
    QueueLoader,
    lowdb,
    FileSync,
    webpush
    //<-- add scheduler as last dependency
  });
  logger.info('🟢 Dependency injection loaded');

  await expressLoader({ app: expressApp });
  logger.info('🟢 Express loaded');

  // rest of loaders...
};