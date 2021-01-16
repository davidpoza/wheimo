import { Container } from 'typedi';

export default ({
  sequelize,
  logger,
  UserService,
  AuthService,
  AccountService,
  TransactionService,
  TagService,
  RuleService,
  RecurrentService,
  OpenbankImporter
}) => {
  Container.set('sequelizeInstance', sequelize);
  logger.info('💉 sequelizeInstance injected');

  Container.set('loggerInstance', logger);
  logger.info('💉 logger instance injected');

  // dependency order is important, services are dependant of sequelize and logger
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

  Container.set('ruleService', new RuleService());
  logger.info('💉 rule service instance injected');

  Container.set('recurrentService', new RecurrentService());
  logger.info('💉 recurrent payments service instance injected');

  Container.set('OpenbankImporter', OpenbankImporter);
  logger.info('💉 openbank importer injected');
}