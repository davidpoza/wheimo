import AES from 'crypto-js/aes.js';
import dayjs from 'dayjs';
import sharp from 'sharp';
import Queue from 'bee-queue';

//import es from 'dayjs/locale/es'
dayjs.locale('es')
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
import LogService from '../services/log.js';
import BudgetService from '../services/budget.js';
import OpenbankImporter from '../services/importers/openbank.js';
import NordigenImporter from '../services/importers/nordigen.js';
import OpenbankPrepaidImporter from '../services/importers/openbank-prepaid.js';
import AttachmentService from '../services/attachment.js';
import NordigenService from '../services/nordigen.js';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader.newConnection();
  logger.info('🟢 Database loaded');

  diLoader({
    AES,
    AccountService,
    AttachmentService,
    AuthService,
    BudgetService,
    NordigenImporter,
    NordigenService,
    OpenbankImporter,
    OpenbankPrepaidImporter,
    Queue,
    RecurrentService,
    RuleService,
    TagService,
    TransactionService,
    LogService,
    UserService,
    dayjs,
    logger,
    sequelize,
    sharp,
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