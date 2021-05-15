import { Container } from 'typedi';
import Config from '../config/config.js';


export default ({
  logger,
  Queue,
  lowdb,
  FileSync
}) => {
  // dependency order is important, services are dependant of sequelize and logger
  Container.set('notificationQueue', Queue);
  logger.info('💉 Bee notifications queue injected');


  const adapter = new FileSync(Config.lowdb)
  const db = lowdb(adapter)
  Container.set('lowdb', db);
  logger.info('💉 lowdb instance injected');

  Container.set('loggerInstance', logger);
  logger.info('💉 logger instance injected');
}