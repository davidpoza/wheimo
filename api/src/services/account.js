import pickBy from 'lodash.pickby';
import { Container } from 'typedi';
import AES from 'crypto-js/aes.js';
import CryptoJS from 'crypto-js';

import config from '../config/config.js';

export default class AccountService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.accountModel = this.sequelize.models.accounts;
    this.transactionModel = this.sequelize.models.transactions;
    this.getTemplate = this.getTemplate.bind(this);
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.updateById = this.updateById.bind(this);
    this.resync = this.resync.bind(this);
  }

  getTemplate(a) {
    return ({
      id: a.id,
      number: a.number,
      name: a.name,
      description: a.description,
      balance: a.balance,
      bankId: a.bankId,
      lastSyncCount: a.lastSyncCount,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    });
  }

  async create({
    number,
    name,
    description,
    userId,
    bankId,
    accessId,
    accessPassword,
    settings
  }) {
    try {
      const encryptedPassword = AES.encrypt(accessPassword, config.aesPassphrase).toString();
      const account = await this.accountModel.create(
        {
          number,
          name,
          description,
          userId,
          bankId,
          accessId,
          accessPassword: encryptedPassword,
          settings
        });
      return account;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(userId) {
    const accounts = await this.accountModel.findAll({ where: { userId } });
    return accounts.map((a) => {
      return (this.getTemplate(a));
    });
  }

  async findById(id, userId, entity = false) {
    let filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId
    });
    const account = await this.accountModel.findOne({ where: filter });
    if (!account) {
      return null;
    }
    if (entity) {
      return account;
    }
    return (this.getTemplate(account.dataValues));
  }

  async updateById(id, userId, values) {
    let filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId
    });
    let encryptedPassword;
    if (values.accessPassword) {
      encryptedPassword = AES.encrypt(values.accessPassword, config.aesPassphrase).toString();
      values.accessPassword = encryptedPassword;
    }
    const affectedRows = await this.accountModel.update(values, { where: filter });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id, userId);
  }

  async deleteById(id, userId) {
    const affectedRows = await this.accountModel.destroy({ where: { id, userId } });
    if (affectedRows === 0) {
      throw new Error('Account does not exist');
    }
  }

  /**
   *
   * @param {Object} param
   * @param {boolean} param.admin - if true then userId is not needed
   */
  async resync({ accountId, userId, from, admin, settings: { contract, product } = {} }) {
    // get bankId of account
    const account = await this.accountModel.findOne({ where: admin ? { id: accountId } : { id: accountId, userId } });
    if (!account) {
      throw new Error('Account does not exist');
    }
    const { bankId, accessId, accessPassword, lastSyncCount } = account.dataValues;
    let importer;

    // select importer
    switch (bankId) {
      case 'opbk':
        importer = Container.get('OpenbankImporter');
      break;
      default:
        throw new Error('Wrong bankId');
    }

    // login
    const descryptedPassword = AES.decrypt(accessPassword, config.aesPassphrase).toString(CryptoJS.enc.Utf8);
    const token = await importer.login(accessId, descryptedPassword);
    this.logger.info('Login into bank account successfully');
    if (!token) {
      const forbidden = new Error('Forbidden: login into bank account failed');
      forbidden.name = 'forbidden';
      throw forbidden;
    }

    // fetch transactions
    const { balance, transactions } = await importer.fetchTransactions(token, from, contract, product);

    // process transactions and get the new ones
    const newTransactionsCount = transactions.length - lastSyncCount;
    this.logger.info(`There are ${newTransactionsCount} new transactions in account #${account.id}`);

    if (newTransactionsCount > 0) {
      const newTransactions = transactions.slice(0, newTransactionsCount - 1);

      // save new transactions into database
      const queryArray = newTransactions.map((t) => {
        return({
          receipt: t.receipt,
          emitterName: t.emitterName,
          receiverName: t.receiverName,
          description: t.description,
          assCard: t.assCard,
          amount: t.amount,
          currency: t.currency,
          date: t.transactionDate,
          valueDate: t.valueDate,
          accountId,
          userId,
        });
      });
      await this.transactionModel.bulkCreate(queryArray);

      // update sync count
      this.logger.info(`Updating lastSyncAccount`);
      await this.updateById(accountId, userId, { balance, lastSyncCount: lastSyncCount + newTransactionsCount });
    }
  }
};
