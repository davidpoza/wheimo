import schedule from 'node-schedule';
import { Container } from 'typedi';
import dayjs from 'dayjs';

import config from '../config/config.js';
import { calculateSavingSeries } from '../shared/utilities.js';

export default class Scheduler {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.transactionService = Container.get('transactionService');
    this.executeExtractionJob = this.executeExtractionJob.bind(this);
    this.scheduleJobs = this.scheduleJobs.bind(this);
  }

  async scheduleJobs() {
    try {
      await this.executeSavingsJob(); // execute immediately
      await this.executeExtractionJob(); // execute immediately
      schedule.scheduleJob('globalTimer', `*/${config.resyncFrequency} * * * *`, async () => {
        await this.executeExtractionJob();
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * This job notifies user about saving schedule
   */
  async executeSavingsJob() {
    try {
      this.logger.info(`Starting extraction job with ${config.resyncFrequency}min frequency`);
      // get all accounts
      const accounts = await this.sequelize.models.accounts.findAll({ where: { bankId: 'piggybank' } });
      if (accounts) {
        this.logger.info(`There are ${accounts.length} accounts to process`);
        for (const a of accounts) {
          this.logger.info(`Found account with params: ${a.savingInitialAmount}, ${a.savingTargetAmount}, ${a.savingInitDate}, ${a.savingTargetDate}, ${a.savingFrequency}, ${a.savingAmountFunc}`);
          const datesSerie = calculateSavingSeries(a.savingInitialAmount, a.savingTargetAmount, a.savingInitDate, a.savingTargetDate, a.savingFrequency, a.savingAmountFunc);
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
}