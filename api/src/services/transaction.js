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
        comments: transaction.comments,
        amount: transaction.amount,
        currency: transaction.currency,
        date: transaction.date,
        valueDate: transaction.valueDate,
        favourite: transaction.favourite,
        balance: transaction.balance,
        accountId: transaction.accountId,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        account: transaction.account,
        tags: transaction.tags.map(tag => ({
          id: tag.id,
          name: tag.name
        }))
      });
    }
    return null;
  }

  /**
    * It only creates transactions for owned accounts.
    * If balance is passed then doesn't update account, it's understood to be an old (passed) transaction
    * @param {Object} param
    * @param {string} param.date - date in format YYYY-MM-DD
    * @param {string} param.valueDate - value date in format YYYY-MM-DD
    */
  async create({
    accountId,
    amount,
    assCard,
    balance,
    comments,
    currency,
    date,
    description,
    emitterName,
    receipt,
    receiverName,
    tags,
    userId,
    valueDate,
  }) {
    let assTags;
    try {
      const account = await this.accountService.findById(accountId, userId, true);
      if (account) {
        let transaction = await this.transactionModel.create(
          {
            accountId,
            amount,
            assCard,
            balance: balance ? balance : account.balance + amount,
            comments,
            currency,
            date: this.dayjs(date, 'YYYY-MM-DD').toDate(),
            description,
            emitterName,
            receipt,
            receiverName,
            valueDate: this.dayjs(valueDate, 'YYYY-MM-DD').toDate(),
          });
        // associates tags
        if (tags) {
          assTags = await transaction.setTags(tags);
          transaction = await this.findById({ id: transaction.dataValues.id, userId });
        } else {
          transaction = { ...transaction.dataValues, tags: [] };
        }
        if (!balance) {
          await this.accountService.updateById(accountId, userId, { balance: account.balance + amount });
        }
        return (this.getTemplate(transaction));
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
   * @param {string} param.sort - asc/desc sorting by date
   */
  async findAll({ accountId, userId, tags, from, to, limit, offset, sort }) {
    const dateFilter = (from || to) ? {} : undefined;
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
          { model: this.sequelize.models.accounts, as: 'account', duplicating: false },
          { model: this.sequelize.models.tags, as: 'tags', duplicating: false }
        ],
        limit,
        offset,
        where: filter,
        order: [ ['date', sort === 'asc' ? 'ASC' : 'DESC'] ]
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
     const transaction = await this.findById({ id, userId, entity: true });
    if (transaction) {
      const affectedRows = await transaction.destroy();
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
          comments: t.comments,
          assCard: t.assCard,
          amount: t.amount,
          currency: t.currency,
          date: t.transactionDate,
          valueDate: t.valueDate,
          balance: t.balance,
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
    let ret = false;
    switch(rule.type) {
      case 'emitterName':
        ret = transaction.emitterName && transaction.emitterName.match(new RegExp(rule.value, 'i'));
        break;
      case 'receiverName':
        ret = transaction.receiverName.match(new RegExp(rule.value, 'i'));
        break;
      case 'description':
        ret = transaction.description.match(new RegExp(rule.value, 'i'));
        break;
      case 'currency':
        ret = transaction.currency === rule.value;
        break;
      case 'account':
        ret = transaction.account === rule.value;
        break;
      case 'bankId':
        ret = transaction.bankId === rule.value;
        break;
      case 'amount': // e.g. lt20;gt10
        const comparisons = rule.value.split(';');
        ret = comparisons.map((comp) => {
          const matches = comp.match(/(gt|gte|lt|lte|eq)(\d*)/);
          const op = matches[1];
          const ruleAmount = parseFloat(matches[2]);
          const transactionAmount = Math.abs(transaction.amount);
          if (op === 'lt') {
            return transactionAmount < ruleAmount;
          } else if (op === 'gt') {
            return transactionAmount > ruleAmount;
          } else if (op === 'lte') {
            return transactionAmount <= ruleAmount;
          } else if (op === 'gte') {
            return transactionAmount >= ruleAmount;
          } else if (op === 'eq') {
            return transactionAmount === ruleAmount;
          }
        }).every((c) => c);
        break;
      case 'card':
        ret = transaction.addCard.match(new RegExp(rule.value, 'i'));
        break;
      case 'isReceipt': // 'true', 'false'
        ret = rule.value === 'true' ? transaction.receipt : !transaction.receipt;
        break;
      case 'isExpense': // 'true', 'false'
        ret = rule.value === 'true' ? parseFloat(transaction.amount) < 0 : parseFloat(transaction.amount) > 0;
        break;
    }
    this.logger.info(`> ${ret ? '✅' : '❌'} transaction ${transaction.id} ${ret ? 'meets' : 'doesnt meet'} rule ${rule.id} of type ${rule.type} with value ${rule.value}`);
    return ret;
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
