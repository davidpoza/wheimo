import { Container } from 'typedi';
import pickBy from 'lodash.pickby';
import CryptoJS from 'crypto-js';

import config from '../config/config.js';
import mockedImportedTransactions from './importers/mock.js';
export default class TransactionService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.sequelizeOp = this.sequelize.Sequelize.Op;
    this.dayjs = Container.get('dayjs');
    this.logger = Container.get('loggerInstance');
    this.transactionModel = this.sequelize.models.transactions;
    this.accountModel = this.sequelize.models.accounts;
    this.accountService = Container.get('accountService');
    this.ruleService = Container.get('ruleService');
    this.AES = Container.get('AES');
    this.resync = this.resync.bind(this);
    this.tagTransaction = this.tagTransaction.bind(this);
    this.transactionMeetsRule = this.transactionMeetsRule.bind(this);
    this.transactionMeetsRules = this.transactionMeetsRules.bind(this);
    this.applyTags = this.applyTags.bind(this);
  }

  /**
   * @param {Object} transaction
   */
  getTemplate(transaction) {
    if (transaction) {
      return ({
        id: transaction.id,
        receipt: transaction.receipt,
        emitterName: transaction.emitterName,
        receiverName: transaction.receiverName,
        assCard: transaction.assCard,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency,
        date: transaction.date,
        valueDate: transaction.valueDate,
        accountId: transaction.accountId,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        tags: transaction.tags.map(tag => ({
          id: tag.id,
          name: tag.name
        }))
      });
    }
    return null;
  }

  /**
    * It only creates transactions for owned accounts
    * @param {Object} param
    * @param {string} param.date - date in format YYYY-MM-DD
    * @param {string} param.valueDate - value date in format YYYY-MM-DD
    */
  async create({
    receipt,
    emitterName,
    receiverName,
    description,
    assCard,
    amount,
    currency,
    date,
    valueDate,
    accountId,
    tags,
    userId,
  }) {
    let assTags;
    try {
      const account = await this.accountService.findById(accountId, userId, true);
      if (account) {
        const transaction = await this.transactionModel.create(
          {
            receipt,
            emitterName,
            receiverName,
            description,
            assCard,
            amount,
            currency,
            date,
            valueDate,
            accountId
          });
        // associates tags
        if (tags) {
          assTags = await transaction.setTags(tags);
        }
        return { ...transaction.dataValues, tags: assTags };
      }
      return null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  /**
   * It only selects owned transactions->accounts
   * @param {Object} param
   * @param {number} param.accountId - filter by account id
   * @param {number} param.userId - filter by user id
   * @param {number} param.limit - query limit
   * @param {number} param.offset - query offset
   * @param {Array<number>} param.tags - array of tag ids to filter by
   * @param {string} param.from - includes transaction from date in format YYYY-MM-DD
   * @param {string} param.to - includes transaction to date in format YYYY-MM-DD
   * @param {string} param.sort - asc/desc sorting by created date
   */
  async findAll({ accountId, userId, tags, from, to, limit, offset, sort }) {
    const dateFilter = (from || tag) ? {} : undefined;
    if (from) dateFilter[this.sequelizeOp.gte] = this.dayjs(from, 'YYYY-MM-DD').toDate();
    if (to) dateFilter[this.sequelizeOp.lte] = this.dayjs(to, 'YYYY-MM-DD').toDate();

    let filter = pickBy({ // pickBy (by default) removes undefined keys
      accountId,
      '$tags.id$': tags,
      '$account.user_id$': userId,
      'date': dateFilter,
    });

    const transactions = await this.transactionModel.findAll(
      {
        include: [
          { model: this.sequelize.models.accounts },
          { model: this.sequelize.models.tags, as: 'tags' }
        ],
        limit,
        offset,
        where: filter,
        order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ]
      });

    return transactions.map((t) => {
      return this.getTemplate(t);
    });
  }

  /**
   * It only selects owned transactions->accounts
   */
  async findById({ id, userId, entity = false, admin = false }) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      '$account.user_id$': admin ? undefined : userId,
    });
    const transaction = await this.transactionModel.findOne({
      where: filter,
      include: [
        { model: this.sequelize.models.tags },
        { model: this.sequelize.models.accounts },
      ]
    });
    if (!transaction) {
      return null;
    }
    if (entity) {
      return transaction;
    }
    return this.getTemplate(transaction.dataValues);
  }


  /**
   * It only updates owned transactions->accounts
   */
  async updateById(id, userId, values) {
    let transaction = this.findById({ id, userId });
    if (transaction) {
      const affectedRows = await this.transactionModel.update(values, { where: { id } });
      if (affectedRows === 0) {
        return null;
      }
      transaction = await this.findById({ id, userId, entity: true });

      if (values.tags) {
        await transaction.setTags(values.tags);
        transaction = await this.findById({ id });
      }

      return this.getTemplate(transaction);
    }
    return null;
  }

  /**
   * It only deletes owned transactions->accounts
   */
  async deleteById(id, userId) {
    const transaction = this.findById({ id, userId });
    if (transaction) {
      const affectedRows = await this.transactionModel.destroy({ where: { id } });
      if (affectedRows === 0) {
        throw new Error('Transaction does not exist');
      }
    }
    return null;
  }

  /**
   * Fetches transactions from all accounts (from all users) and apply tags if any rule is met
   * @param {Object} param
   * @param {boolean} param.admin - if true then userId is not needed
   */
  async resync({ accountId, userId, from, admin, settings: { contract, product } = {} }) {
    let balance;
    let transactions;
    let newTransactionsCount;
    let lastSyncCount;

    const account = await this.accountModel.findOne({ where: admin ? { id: accountId } : { id: accountId, userId } });
    if (!account) {
      throw new Error('Account does not exist');
    }

    if (config.debug !== true) {
      // get bankId of account
      const { bankId, accessId, accessPassword } = account.dataValues;
      ({lastSyncCount} = account.dataValues);

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
      const descryptedPassword = this.AES.decrypt(accessPassword, config.aesPassphrase).toString(CryptoJS.enc.Utf8);
      const token = await importer.login(accessId, descryptedPassword);
      this.logger.info('Login into bank account successfully');
      if (!token) {
        const forbidden = new Error('Forbidden: login into bank account failed');
        forbidden.name = 'forbidden';
        throw forbidden;
      }

      // fetch transactions
      const { balance: fetchedBalance, transactions: fetchedTransactions } = await importer
        .fetchTransactions(token, from, contract, product);
      transactions = fetchedTransactions;
      balance = fetchedBalance;
    } else {
      // with mocked data
      transactions = mockedImportedTransactions.transactions;
      balance = mockedImportedTransactions.balance;
      lastSyncCount = 0;
    }

    // process transactions and get the new ones
    newTransactionsCount = transactions.length - lastSyncCount;
    this.logger.info(`There are ${newTransactionsCount} new transactions in account #${accountId}`);

    if (newTransactionsCount > 0) {
      const newTransactions = transactions.slice(0, newTransactionsCount);

      // transformation from importer format to entity format in order to save new transactions into database
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
      const res = await this.transactionModel.bulkCreate(queryArray);
      if (!res) {
        throw new Error('error during transaction creation');
      }

      const createdTransactions = res.map((t) => {
        return (t.dataValues);
      });
      // apply tagging rules over all new transactions
      const userRules = await this.ruleService.findAll(account.dataValues.userId); // get all user rules of transaction owner
      this.applyTags(createdTransactions, userRules);

      // update sync count
      this.logger.info(`Updating lastSyncAccount`);
      await this.updateById(accountId, userId, { balance, lastSyncCount: lastSyncCount + newTransactionsCount });
    }
  }

  /**
   * Tag transaction with specified tag, adding it to existing ones.
   * @param {*} transactionId
   * @param {*} tagId
   */
  async tagTransaction(transactionId, tagId) {
    this.logger.info(`> ✅ tagging🏷️transaction ${transactionId} with tag ${tagId}`);
    const transaction = await this.findById({ id:transactionId, admin: true, entity: true });
    if (!transaction) {
      return null;
    }
    const existingTags = transaction.tags.map((t) => t.id);
    transaction.setTags([ ...existingTags, tagId ]);
  }

  /**
   * Checks if rule matches with transaction
   * @param {Object} transaction
   * @param {string} transaction.emitterName
   * @param {string} transaction.receiverName
   * @param {string} transaction.description
   * @param {string} transaction.currency
   * @param {string} transaction.card
   * @param {string} transaction.bankId
   * @param {string} transaction.account - this is the account.number field
   * @param {boolean} transaction.receipt
   * @param {number} transaction.amount
   * @param {Object} rule
   * @param {string} rule.type
   * @param {string} rule.value - expression with valid format. prepare doc
   */
  transactionMeetsRule(transaction, rule) {
    switch(rule.type) {
      case 'emitterName':
        return transaction.emitterName.match(new RegExp(rule.value, 'i'));
      case 'receiverName':
        return transaction.receiverName.match(new RegExp(rule.value, 'i'));
      case 'description':
        return transaction.description.match(new RegExp(rule.value, 'i'));
      case 'currency':
        return transaction.currency === rule.value;
      case 'account':
        return transaction.account === rule.value;
      case 'bankId':
        return transaction.bankId === rule.value;
      case 'amount': // e.g. lt20;gt10
        const comparisons = rule.value.split(';');
        return comparisons.map((comp) => {
          const matches = comp.match(/(gt|gte|lt|lte|eq)(\d*)/);
          const op = matches[1];
          const amount = parseFloat(matches[2]);
          if (op === 'lt') {
            return transaction.amount < amount;
          } else if (op === 'gt') {
            return transaction.amount > amount;
          } else if (op === 'lte') {
            return transaction.amount <= amount;
          } else if (op === 'gte') {
            return transaction.amount >= amount;
          } else if (op === 'eq') {
            return transaction.amount === amount;
          }
        }).every((c) => c);
      case 'card':
        return transaction.addCard.match(new RegExp(rule.value, 'i'));
      case 'receipt': // true, false
        return rule.value ? transaction.receipt : !transaction.receipt;
    }
  }

  transactionMeetsRules(transaction, rules) {
    return rules.reduce((acc, curr) => (acc && this.transactionMeetsRule(transaction, curr)), true);
  }

  /**
   * @param {Array<Object>} transactions
   * @param {Array<Object} userRules - objects must have tags prop
   */
  applyTags(transactions, userRules) {
    const tagRules = {}; // build object with tagId as keys, and rule array as value
    userRules.forEach((rule) => {
      rule.tags.forEach((tag) => {
        if (!tagRules[tag.id]) {
          tagRules[tag.id] = [rule];
        } else if (!tagRules[tag.id].includes(rule)) {
          tagRules[tag.id].push(rule);
        }
      });
    });

    this.logger.info(`> applyTags`);
    transactions.forEach((transaction) => {
      Object.keys(tagRules).forEach((tagId) => {
        if (this.transactionMeetsRules(transaction, tagRules[tagId])) {
          this.tagTransaction(transaction.id, parseInt(tagId, 10));
        }
      });
    });
  }

  /**
   * Calculates total income and total expenses for given transactions
   * @param {*} transactions
   */
  calculateTotals(transactions) {
    let income = 0;
    let expenses = 0;
    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        expenses += (-1) * transaction.amount;
      }
    });
    return ({
      income, expenses
    });
  }
};
