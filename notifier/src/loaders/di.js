import { Container } from 'typedi';
import Config from '../config/config.js';


export default ({
  logger,
  Queue,
}) => {
  // dependency order is important, services are dependant of sequelize and logger
  Container.set('notificationQueue', Queue);
  logger.info('💉 Bee notifications queue injected');

  Container.set('loggerInstance', logger);
  logger.info('💉 logger instance injected');
}