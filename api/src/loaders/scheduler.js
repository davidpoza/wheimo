import schedule from 'node-schedule';
import { Container } from 'typedi';
import dayjs from 'dayjs';

import config from '../config/config.js';
import { calculateSavingSeries } from '../shared/utilities.js';

/**
 * Each time server starts we're going to do following tasks:
 * - fetch banks
 * - generate saving notifications
 *   - create new job if doesn't exist any previous job in "succeeded" or "waiting" queue
 *   - clean succeeded jobs
 */
export default class Scheduler {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.transactionService = Container.get('transactionService');
    this.notificationQueue = Container.get('notificationQueue');
    this.executeExtractionJob = this.executeExtractionJob.bind(this);
    this.scheduleJobs = this.scheduleJobs.bind(this);
    this.getAllJobs = this.getAllJobs.bind(this);
    this.cleanSucceeded = this.cleanSucceeded.bind(this);
  }

  async scheduleJobs() {
    try {
      await this.executeSavingsJob(); // execute immediately
      await this.executeExtractionJob(); // execute immediately

      schedule.scheduleJob('fetcherTimer', `*/${config.resyncFrequency} * * * *`, async () => {
        await this.executeExtractionJob();
      });
      schedule.scheduleJob('savingsTimer', `0 0 * * *`, async () => {
        await this.executeSavingsJob();
        await this.cleanSucceeded();
      });

      // procesamiento de la cola de notificaciones ira en un endpoint que el cliente llamará para consultar si hay nuevas notificaciones

      this.notificationQueue.process(async (job, done) => {
        console.log(job);
        done();
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * This job notifies user about saving schedule.
   * Run all over the piggy bank accounts and check if today is included in account savings serie.
   * Notifiy account owner pushing message to queue only if already doesn't exist any message (waiting or succeeded) for current account.
   */
  async executeSavingsJob() {
    try {
      this.logger.info(`Starting extraction job with ${config.resyncFrequency}min frequency`);
      // get all accounts
      const accounts = await this.sequelize.models.accounts.findAll({ where: { bankId: 'piggybank' } });
      if (accounts) {
        this.logger.info(`There are ${accounts.length} accounts to process`);
        for (const a of accounts) {
          this.logger.info(`Found account with params:
            ${a.savingInitialAmount},
            ${a.savingTargetAmount},
            ${a.savingInitDate},
            ${a.savingTargetDate},
            ${a.savingFrequency},
            ${a.savingAmountFunc}
          `);
          const datesSerie = calculateSavingSeries(
            a.savingInitialAmount,
            a.savingTargetAmount,
            a.savingInitDate,
            a.savingTargetDate,
            a.savingFrequency,
            a.savingAmountFunc
          );
          const today = dayjs().format('YYYY/MM/DD');
          const found = datesSerie.find(d => d.date === today);
          if (found) {
            const existingJobs = await this.getAllJobs();
            const alreadyExists = existingJobs.filter(d => d?.data?.userId === a.userId && d?.data?.accountId === a.id).length > 0;
            if (!alreadyExists) {
              this.logger.info(`📨 Saving notification sent: ${found.amount}; currently: ${found.savings}`);
              await this.notificationQueue.createJob({
                title: 'Remember to deposit in the piggy bank',
                content: `Remember to deposit ${found.amount} in your piggy bank. Current savings are ${found.savings}`,
                accountId: a.id,
                userId: a.userId
              }).save();
            } else {
              this.logger.info(`📨 Notification already exists for account ${a.id} from user ${a.userId}`);
            }
          }
        };
        this.logger.info(`Job ended`);
      }
    } catch (err) {
      if (err.name === 'not-found') {
        this.logger('no transactions found for this query');
      }
      throw err;
    }
  }

  async executeExtractionJob() {
    try {
      this.logger.info(`Starting savings checker job`);
      // get all accounts
      const accounts = await this.sequelize.models.accounts.findAll({});
      if (accounts) {
        this.logger.info(`There are ${accounts.length} accounts to process`);
        for (const a of accounts) {
          if ((a.accessId && a.accessPassword) || config.debug) {
            this.transactionService.resync({
              accountId: a.dataValues.id,
              from: dayjs().subtract(60, 'day').format('YYYY-MM-DD'), // time window of 10 days is more likely suficient
              admin: true,
              settings: a.dataValues.settings || {}
            });
          }
        };
        this.logger.info(`Job ended`);
      }
    } catch (err) {
      if (err.name === 'not-found') {
        this.logger('no transactions found for this query');
      }
      throw err;
    }
  }

  async getAllJobs() {
    let waiting;
    let succeeded;
    try {
      waiting = await this.notificationQueue.getJobs('waiting');
    } catch(error) {
      waiting = [];
    }
    try {
      succeeded = await this.notificationQueue.getJobs('succeeded');
    } catch(error) {
      succeeded = [];
    }
    return [...waiting, ...succeeded];
  }

  async cleanSucceeded() {
    this.logger.info(`Cleaning succeeded jobs`);
    const jobs = await this.notificationQueue.getJobs('succeeded');
    for (const j of jobs) {
      try {
        console.log(">>", j)
        await this.notificationQueue.removeJob(j.id);
      } catch(error) {
        this.logger(`⚠ Error removing job ${j.id}`);
      }
    }
  }

}