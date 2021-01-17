import schedule from 'node-schedule';
import { Container } from 'typedi';
import dayjs from 'dayjs';

import config from '../config/config.js';

export default class Scheduler {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.accountService = Container.get('accountService');
    this.executeJob = this.executeJob.bind(this);
    this.scheduleJobs = this.scheduleJobs.bind(this);
  }

  async scheduleJobs() {
    try {
      await this.executeJob(); // execute immediately
      schedule.scheduleJob('globalTimer', `*/${config.resyncFrequency} * * * *`, async () => {
        await this.executeJob();
      });
    } catch (err) {
      throw err;
    }
  }

  async executeJob() {
    try {
      this.logger.info(`Starting scheduler with ${config.resyncFrequency}min frequency`);
      // get all accounts
      const accounts = await this.sequelize.models.accounts.findAll({ });
      if (accounts) {
        this.logger.info(`There are ${accounts.length} accounts to process`);
        for (const a of accounts) {
          console.log(a.dataValues.id);
          this.accountService.resync({
            accountId: a.dataValues.id,
            from: dayjs().subtract(10, 'day').format('YYYY-MM-DD'), // time window of 10 days is more likely suficient
            admin: true,
            settings: a.dataValues.settings || {}
          });
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