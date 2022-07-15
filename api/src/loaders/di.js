import { Container } from 'typedi';
import Config from '../config/config.js';


export default ({
  sequelize,
  logger,
  UserService,
  AuthService,
  AccountService,
  TransactionService,
  TagService,
  RuleService,
  LogService,
  BudgetService,
  RecurrentService,
  AttachmentService,
  OpenbankImporter,
  NordigenImporter,
  OpenbankPrepaidImporter,
  NordigenService,
  AES,
  dayjs,
  sharp,
  Queue,
}) => {
  // dependency order is important, services are dependant of sequelize and logger
  Container.set('notificationQueue', new Queue(Config.notificationsQueue, {
    redis: {
      host: 'redis',
    },
  }));
  logger.info('💉 Bee notifications queue injected');

  Container.set('AES', AES);
  logger.info('💉 AES injected');

  Container.set('dayjs', dayjs);
  logger.info('💉 dayjs injected');

  Container.set('sharp', sharp);
  logger.info('💉 sharp injected');

  Container.set('sequelizeInstance', sequelize);
  logger.info('💉 sequelizeInstance injected');

  Container.set('loggerInstance', logger);
  logger.info('💉 logger instance injected');

  Container.set('ruleService', new RuleService());
  logger.info('💉 rule service instance injected');

  Container.set('budgetService', new BudgetService());
  logger.info('💉 budget service instance injected');

  Container.set('userService', new UserService());
  logger.info('💉 user service instance injected');

  Container.set('authService', new AuthService());
  logger.info('💉 auth service instance injected');

  Container.set('accountService', new AccountService());
  logger.info('💉 account service instance injected');

  Container.set('transactionService', new TransactionService());
  logger.info('💉 transaction service instance injected');

  Container.set('tagService', new TagService());
  logger.info('💉 tag service instance injected');

  Container.set('recurrentService', new RecurrentService());
  logger.info('💉 recurrent payments service instance injected');

  Container.set('attachmentService', new AttachmentService());
  logger.info('💉 attachments service instance injected');

  Container.set('nordigenService', new NordigenService());
  logger.info('💉 NordigenService injected');

  Container.set('OpenbankImporter', OpenbankImporter);
  logger.info('💉 openbank importer injected');

  Container.set('NordigenImporter', NordigenImporter);
  logger.info('💉 nordigen importer injected');

  Container.set('OpenbankPrepaidImporter', OpenbankPrepaidImporter);
  logger.info('💉 OpenbankPrepaid importer injected');

  Container.set('logService', new LogService());
  logger.info('💉 log service instance injected');
}