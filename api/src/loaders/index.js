import expressLoader from './express.js';
import sequelizeLoader from './sequelize.js';
import diLoader from './di.js';
import logger from './logger.js';
import Scheduler from './scheduler.js';
import AuthService from '../services/auth.js';
import UserService from '../services/user.js';
import TransactionService from '../services/transaction.js';
import AccountService from '../services/account.js';
import TagService from '../services/tag.js';
import RuleService from '../services/rule.js';
import RecurrentService from '../services/recurrent.js';
import OpenbankImporter from '../services/importers/openbank.js';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  logger.info('🟢 Database loaded');

  diLoader({
    sequelize,
    logger,
    AuthService,
    UserService,
    TransactionService,
    AccountService,
    TagService,
    RuleService,
    RecurrentService,
    OpenbankImporter,
    //<-- add scheduler as last dependency
  });
  logger.info('🟢 Dependency injection loaded');

  logger.info('🟢 scheduler loaded');
  const scheduler = new Scheduler();
  await scheduler.scheduleJobs();

  await expressLoader({ app: expressApp });
  logger.info('🟢 Express loaded');

  // rest of loaders...
};