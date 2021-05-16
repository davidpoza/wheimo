import { Container } from 'typedi';
import Config from '../config/config.js';


export default ({
  logger,
  QueueLoader,
  lowdb,
  FileSync,
  webpush
}) => {
  webpush.setVapidDetails(
    `mailto:${Config.webPushEmail}`,
    Config.publicVapidKey,
    Config.privateVapidKey
  )
  Container.set('webpush', webpush);
  logger.info('💉 webpush injected');

  const adapter = new FileSync(Config.lowdb)
  const db = lowdb(adapter)
  Container.set('lowdb', db);
  logger.info('💉 lowdb instance injected');

  Container.set('loggerInstance', logger);
  logger.info('💉 logger instance injected');

  // dependency order is important, services are dependant of sequelize and logger
  Container.set('notificationQueue', new QueueLoader());
  logger.info('💉 Bee notifications queue injected');
}