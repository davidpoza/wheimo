import { Container } from 'typedi';
import pickBy from 'lodash.pickby';
import CryptoJS from 'crypto-js';
import md5 from 'md5';
import dayjs from 'dayjs';

import { leftPadding } from '../shared/utilities.js';
import config from '../config/config.js';
import mockedImportedTransactions from './importers/mock.js';
import AttachmentService from './attachment.js';

export default class TransactionService {
  constructor() {
    this.sequelize = Container.get("sequelizeInstance");
    this.sequelizeOp = this.sequelize.Sequelize.Op;
    this.sequelizeCol = this.sequelize.Sequelize.col;
    this.sequelizeFn = this.sequelize.Sequelize.fn;
    this.sequelizeLt = this.sequelize.Sequelize.literal;
    this.dayjs = Container.get("dayjs");
    this.logger = Container.get("loggerInstance");
    this.transactionModel = this.sequelize.models.transactions;
    this.accountModel = this.sequelize.models.accounts;
    this.accountService = Container.get("accountService");
    this.ruleService = Container.get("ruleService");
    this.AES = Container.get("AES");
    this.notificationQueue = Container.get("notificationQueue");
    this.resync = this.resync.bind(this);
    this.tagTransaction = this.tagTransaction.bind(this);
    this.tagTransactions = this.tagTransactions.bind(this);
    this.transactionMeetsRule = this.transactionMeetsRule.bind(this);
    this.transactionMeetsRules = this.transactionMeetsRules.bind(this);
    this.transactionMeetsRules = this.transactionMeetsRules.bind(this);
    this.applyTags = this.applyTags.bind(this);
    this.untagTransaction = this.untagTransaction.bind(this);
    this.untagTransactions = this.untagTransactions.bind(this);
    this.getTransactionsCalendar = this.getTransactionsCalendar.bind(this);
    this.calculateStatistics = this.calculateStatistics.bind(this);
    this.getTemplate = this.getTemplate.bind(this);
    this.create = this.create.bind(this);
    this.findById = this.findById.bind(this);
    this.findAll = this.findAll.bind(this);
    this.isAlreadyImported = this.isAlreadyImported.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.calculateExpensesByTags = this.calculateExpensesByTags.bind(this);
  }

  /**
   * @param {Object} transaction
   */
  async getTemplate(transaction, toQueryTags = false) {
    if (toQueryTags) {
      const t = await this.findById({ id: transaction.id });
      transaction.tags = t.tags;
    }
    if (transaction) {
      return {
        account: transaction.account,
        accountId: transaction.accountId,
        amount: transaction.amount,
        assCard: transaction.assCard,
        balance: transaction.balance,
        comments: transaction.comments,
        createdAt: transaction.createdAt,
        currency: transaction.currency,
        date: transaction.date,
        description: transaction.description,
        emitterName: transaction.emitterName,
        favourite: transaction.favourite,
        id: transaction.id,
        importId: transaction.importId,
        receipt: transaction.receipt,
        draft: transaction.draft,
        receiverName: transaction.receiverName,
        updatedAt: transaction.updatedAt,
        valueDate: transaction.valueDate,
        attachmentCount: transaction.dataValues && transaction.dataValues.attachmentCount,
        attachments: transaction.attachments
          ? transaction.attachments.map((attachment) => ({
              id: attachment.id,
              filename: attachment.filename,
              description: attachment.description,
              type: attachment.type,
              createdAt: attachment.createdAt,
            }))
          : [],
        tags: transaction.tags
          ? transaction.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
            }))
          : [],
      };
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
    draft,
    receiverName,
    tags,
    userId,
    valueDate,
  }) {
    let assTags;
    try {
      const account = await this.accountService.findById(
        accountId,
        userId,
        true
      );

      let newBalance = account.balance;
      if (balance) newBalance = balance;
      if (!draft && !balance) newBalance += amount;
      const dateString = dayjs(valueDate).format('YYYY-MM-DD');
      if (account) {
        const importId = md5(`${accountId}${balance}${dateString}${description}${amount}`);
        let transaction = await this.transactionModel.create({
          importId,
          accountId,
          amount,
          assCard,
          balance: newBalance,
          comments,
          currency,
          date: this.dayjs(date, "YYYY-MM-DD").toDate(),
          description,
          emitterName,
          receipt,
          draft,
          receiverName,
          valueDate: this.dayjs(valueDate, "YYYY-MM-DD").toDate(),
        });
        // associates tags
        if (tags) {
          assTags = await transaction.setTags(tags);
          transaction = await this.findById({
            id: transaction.dataValues.id,
            userId,
          });
        } else {
          transaction = { ...transaction.dataValues, tags: [] };
        }
        if (!balance && !draft) {
          await this.accountService.updateById(accountId, userId, {
            balance: newBalance,
          });
        }
        const msg = this.notificationQueue.createJob({
          title: "new transaction",
          content: `transaction of ${amount}€. ${description || ""}`,
          userId,
        });
        msg.save();
        return await this.getTemplate(transaction);
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
   * @param {string} param.search - search term
   */
  async findAll({
    accountId,
    userId,
    tags,
    from,
    to,
    limit,
    offset,
    sort,
    search,
    min,
    max,
    operationType,
    isFav,
    isDraft,
    hasAttachments,
    ids,
    entity,
  }) {
    const dateFilter = from || to ? {} : undefined;
    if (from)
      dateFilter[this.sequelizeOp.gte] = this.dayjs(
        from,
        "YYYY-MM-DD"
      ).toDate();
    if (to)
      dateFilter[this.sequelizeOp.lte] = this.dayjs(to, "YYYY-MM-DD").toDate();
    const searchFilter = search ? {} : undefined;

    let operationTypeFilter =
      operationType && operationType !== "all" ? {} : undefined;
    if (operationType === "expense")
      operationTypeFilter[this.sequelizeOp.lt] = 0;
    if (operationType === "income")
      operationTypeFilter[this.sequelizeOp.gt] = 0;

    let limitsFilter = min || max ? {} : undefined;
    if (min !== undefined && max !== undefined)
      limitsFilter[this.sequelizeOp.between] = [
        parseInt(min, 10),
        parseInt(max, 10),
      ];
    else if (min !== undefined && max === undefined)
      limitsFilter[this.sequelizeOp.gt] = parseInt(min, 10);
    else if (min === undefined && max !== undefined)
      limitsFilter[this.sequelizeOp.lt] = parseInt(max, 10);

    let filter = pickBy({
      // pickBy (by default) removes undefined keys
      id: Array.isArray(ids) ? ids : ids?.split(','),
      accountId,
      "$tags.id$": tags,
      "$account.user_id$": userId,
      date: dateFilter,
      favourite: isFav === "1" && "1",
      draft: isDraft ? "1" : "0",
    });

    if (limitsFilter) {
      filter[this.sequelizeOp.and] = [
        this.sequelize.where(
          this.sequelizeFn("ABS", this.sequelizeCol("amount")),
          limitsFilter
        ),
      ];
    }

    if (operationTypeFilter) {
      filter["amount"] = operationTypeFilter;
    }

    if (searchFilter) {
      searchFilter[this.sequelizeOp.substring] = search;
      filter[this.sequelizeOp.or] = [
        { description: searchFilter },
        { comments: searchFilter },
        { emitterName: searchFilter },
        { receiverName: searchFilter },
      ];
    }

    const transactions = await this.transactionModel.findAll({
      include: [
        {
          model: this.sequelize.models.accounts,
          as: "account",
          duplicating: false,
        },
        { model: this.sequelize.models.tags, as: "tags", duplicating: false },
        { model: this.sequelize.models.attachments, as: "attachments", duplicating: false },
      ],
      attributes: {
        include: [
          "amount",
          "id",
          "comments",
          "description",
          "currency",
          "date",
          "value_date",
          "favourite",
          "balance",
          "account_id",
          "receiverName",
          "emitterName",
          "draft",
          hasAttachments && [this.sequelizeFn("COUNT", this.sequelizeCol("attachments.id")), "attachmentCount"]
        ].filter(e => e)
      },
      limit,
      offset,
      where: filter,
      order: [["date", sort === "asc" ? "ASC" : "DESC"]],
      ...(hasAttachments && {
        group: ['attachments.id'],
        having: {
          attachmentCount : {
            [this.sequelizeOp.gt]: 0
          }
        },
      })
    });

    if (entity) {
      return transactions;
    }

    return Promise.all(transactions.map(async (t) => {
      return await this.getTemplate(t, tags !== undefined);
    }));
  }

  /**
   * It only selects owned transactions->accounts
   */
  async findById({ id, userId, entity = false, admin = false }) {
    const filter = pickBy({
      // pickBy (by default) removes undefined keys
      id,
      "$account.user_id$": admin ? undefined : userId,
    });
    const transaction = await this.transactionModel.findOne({
      where: filter,
      include: [
        { model: this.sequelize.models.tags },
        { model: this.sequelize.models.accounts },
        { model: this.sequelize.models.attachments },
      ],
    });
    if (!transaction) {
      return null;
    }
    if (entity) {
      return transaction;
    }
    return await this.getTemplate(transaction.dataValues);
  }

  async isAlreadyImported(importId) {
    const transaction = await this.transactionModel.findOne({
      where: { importId },
    });
    if (transaction) {
      return true;
    }
    return false;
  }

  /**
   * It only updates owned transactions->accounts
   */
  async updateById(id, userId, values) {
    console.log(userId)
    const attService = new AttachmentService();
    let transaction = await this.findById({ id, userId });

    if (transaction) {
      const affectedRows = await this.transactionModel.update(values, {
        where: { id },
      });
      if (affectedRows === 0) {
        return null;
      }
      transaction = await this.findById({ id, userId, entity: true });

      if (transaction && values.tags) {
        await transaction.setTags(values.tags);
        transaction = await this.findById({ id });
      }
      if (transaction && values.attachments) {
        for (const attachmentId of values.attachments) {
          await attService.updateById(attachmentId, userId, {
            transactionId: id
          });
        }
      }

      return await this.getTemplate(transaction);
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
        throw new Error("Transaction does not exist");
      }
      return transaction;
    }
    return null;
  }


  /**
   * It only deletes owned transactions->accounts
   */
   async deleteByIdList(ids, userId) {
    const transactions = await this.findAll({ ids, userId, entity: true });

    if (transactions) {
      for (const t of transactions) {
        const affectedRows = await t.destroy();
        if (affectedRows === 0) {
          throw new Error("Transaction does not exist");
        }
      }
      return transactions.map(t => t.id);
    }
    return null;
  }

  /**
   * Fetches transactions from all accounts (from all users) and apply tags if any rule is met
   * @param {Object} param
   * @param {boolean} param.admin - if true then userId is not needed
   */
  async resync({
    accountId,
    userId,
    from,
    admin,
    settings: { contract, product } = {},
  }) {
    let balance;
    let transactions;
    let newTransactionsCount;

    const account = await this.accountModel.findOne({
      where: admin ? { id: accountId } : { id: accountId, userId },
    });
    if (!account) {
      throw new Error("Account does not exist");
    }

    if (config.debug !== true) {
      // get bankId of account
      const { bankId, accessId, accessPassword, settings, balance: currentBalance } = account.dataValues;
      if (!accessId || !accessPassword) {
        throw new Error(
          "Forbidden: accessId or accessPassword not defined"
        );
      }
      let importer;

      // select importer
      switch (bankId) {
        case "opbk":
          importer = Container.get("OpenbankImporter");
          break;
        case "nordigen":
          importer = Container.get("NordigenImporter");
          break;
        default:
          throw new Error("Wrong bankId");
      }

      // login
      const decryptedPassword = this.AES.decrypt(
        accessPassword,
        config.aesPassphrase
      ).toString(CryptoJS.enc.Utf8);

      const token = await importer.login(accessId, decryptedPassword);
      this.logger.info("Login into bank account successfully");
      if (!token) {
        const forbidden = new Error(
          `Forbidden: login into bank account ${accountId} failed`
        );
        forbidden.name = "forbidden";
        throw forbidden;
      }

      // fetch transactions
      const { balance: fetchedBalance, transactions: fetchedTransactions } =
        await importer.fetchTransactions({ accessId, decryptedPassword, token, from, contract, product, settings, currentBalance });
      transactions = fetchedTransactions || [];

      balance = fetchedBalance;
    } else {
      // with mocked data
      transactions = mockedImportedTransactions.transactions;
      balance = mockedImportedTransactions.balance;
    }

    this.logger.info(
      `💸It's been fetched ${transactions?.length} transactions in account #${accountId}`
    );

    const queryArray = [];
    for (const t of transactions) {
      const dateString = this.dayjs(t.valueDate).format('YYYY-MM-DD');
      const importId = md5(`${accountId}${t.balance}${dateString}${t.description}${t.amount}`);
      const exist = await this.isAlreadyImported(importId);
      if (!exist) {
        queryArray.push({
          importId,
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
      }
    }
    if (queryArray.length === 0) return;
    const res = await this.transactionModel.bulkCreate(queryArray);
    if (!res) {
      throw new Error("error during transaction creation");
    }

    const createdTransactions = res.map((t) => {
      return t.dataValues;
    });
    // apply tagging rules over all new transactions
    const userRules = await this.ruleService.findAll(account.dataValues.userId); // get all user rules of transaction owner
    this.applyTags(createdTransactions, userRules);

    // update sync count
    const lastTransactionBalance = createdTransactions[0].balance;
    this.logger.info(`Updating account's balance: ${lastTransactionBalance}`);
    await this.accountService.updateById(accountId, userId, {
      balance: lastTransactionBalance,
    });
  }

  /**
   * Tag transaction with specified tag, adding it to existing ones.
   * @param {*} transactionId
   * @param {*} tagId
   */
  async tagTransaction(transactionId, tagId) {
    this.logger.info(
      `> ✅ tagging🏷️transaction ${transactionId} with tag ${tagId}`
    );
    const transaction = await this.findById({
      id: transactionId,
      admin: true,
      entity: true,
    });
    if (!transaction) {
      return null;
    }
    const existingTags = transaction.tags.map((t) => t.id);
    transaction.setTags([...existingTags, tagId]);
  }

  /**
   * Tag transactions with one or more specified tags, adding it to existing ones.
   * @param {Array<Number>} transactions
   * @param {Array<Number>} tagsId
   * @returns {Object} ids as keys, containing whole tag array for each one.
   */
  async tagTransactions(ids, tagIds, userId) {
    const transactions = await this.findAll({
      ids,
      entity: true,
      userId
    })
    const ret = {};
    for (const t of transactions) {
      this.logger.info(
        `> ✅ tagging🏷️transaction ${t.id} with tags ${tagIds.join(', ')}`
      );
      const existingTags = t.tags.map((t) => t.id);
      await t.setTags([...existingTags, ...tagIds]);
      await t.save();
      await t.reload();
      ret[t.id] = t.tags.map(tag => ({
        id: tag.id,
        name: tag.name
      }));
    };
    return ret;
  }

  /**
   * untag transaction with specified tag, removing it to existing ones.
   * @param {*} transactionId
   * @param {*} tagId
   */
  async untagTransaction(transactionId, tagId) {
    this.logger.info(
      `> ✅ untagging🏷️tag ${tagId} from transaction ${transactionId}`
    );
    const transaction = await this.findById({
      id: transactionId,
      admin: true,
      entity: true,
    });
    if (!transaction) {
      return null;
    }
    const existingTags = transaction.tags.map((t) => t.id);
    transaction.setTags(existingTags.filter((t) => t !== tagId));
  }

  /**
   * removes given tag from all specified transactions
   * @param {*} transactionId
   * @param {*} tagId
   */
  async untagTransactions(transactions, tagId) {
    this.logger.info(`> ✅ untagging🏷️tag ${tagId} from transactions`);
    for (const t of transactions) {
      await this.untagTransaction(t.id, tagId);
    }
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
    switch (rule.type) {
      case "emitterName":
        ret = transaction?.emitterName?.match(new RegExp(rule.value, "i"));
        break;
      case "receiverName":
        ret = transaction?.receiverName?.match(new RegExp(rule.value, "i"));
        break;
      case "description":
        ret = transaction?.description?.match(new RegExp(rule.value, "i"));
        break;
      case "currency":
        ret = transaction?.currency === rule.value;
        break;
      case "account":
        ret = transaction?.account === rule.value;
        break;
      case "bankId":
        ret = transaction?.bankId === rule.value;
        break;
      case "amount": // e.g. lt20;gt10
        const comparisons = rule.value.split(";");
        ret = comparisons
          .map((comp) => {
            const matches = comp.match(/(gt|gte|lt|lte|eq)(\d*)/);
            const op = matches[1];
            const ruleAmount = parseFloat(matches[2]);
            const transactionAmount = Math.abs(transaction.amount);
            if (op === "lt") {
              return transactionAmount < ruleAmount;
            } else if (op === "gt") {
              return transactionAmount > ruleAmount;
            } else if (op === "lte") {
              return transactionAmount <= ruleAmount;
            } else if (op === "gte") {
              return transactionAmount >= ruleAmount;
            } else if (op === "eq") {
              return transactionAmount === ruleAmount;
            }
          })
          .every((c) => c);
        break;
      case "card":
        ret = transaction.addCard.match(new RegExp(rule.value, "i"));
        break;
      case "isReceipt": // 'true', 'false'
        ret =
          rule.value === "true" ? transaction.receipt : !transaction.receipt;
        break;
      case "isExpense": // 'true', 'false'
        ret =
          rule.value === "true"
            ? parseFloat(transaction.amount) < 0
            : parseFloat(transaction.amount) > 0;
        break;
    }
    this.logger.info(
      `> ${ret ? "✅" : "❌"} transaction ${transaction.id} ${
        ret ? "meets" : "doesnt meet"
      } rule ${rule.id} of type ${rule.type} with value ${rule.value}`
    );
    return ret;
  }

  transactionMeetsRules(transaction, rules) {
    return rules.reduce(
      (acc, curr) => acc && this.transactionMeetsRule(transaction, curr),
      true
    );
  }

  /**
   * @param {Array<Object>} transactions
   * @param {Array<Object} userRules - objects must have tags prop
   * @return {Array<Number>} transaction ids which have been finally tagged
   */
  applyTags(transactions, userRules) {
    const transactionsTagged = [];
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
          transactionsTagged.push(transaction.id);
        }
      });
    });
    return transactionsTagged;
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
        expenses += -1 * transaction.amount;
      }
    });
    return {
      income,
      expenses,
    };
  }

  async calculateExpensesByTags({ accountId, userId, from, to }) {
    const dateFilter = from || to ? {} : undefined;
    if (from)
      dateFilter[this.sequelizeOp.gte] = this.dayjs(
        from,
        "YYYY-MM-DD"
      ).toDate();
    if (to)
      dateFilter[this.sequelizeOp.lte] = this.dayjs(to, "YYYY-MM-DD").toDate();

    let filter = pickBy({
      // pickBy (by default) removes undefined keys
      accountId,
      "$account.user_id$": userId,
      date: dateFilter,
      amount: { [this.sequelizeOp.lt]: 0 },
    });
    const tags = {
      "-1": { name: "non-tagged", amount: 0 },
    };
    const transactions = await this.transactionModel.findAll({
      include: [
        {
          model: this.sequelize.models.accounts,
          as: "account",
          duplicating: false,
        },
        { model: this.sequelize.models.tags, as: "tags", duplicating: false },
      ],
      where: filter,
    });

    transactions.forEach((transaction) => {
      transaction.tags.forEach((tag) => {
        const { id, name } = tag.dataValues;
        if (!tags[id]) tags[id] = { name, amount: 0 };
        if (transaction.amount < 0) {
          tags[id].amount += transaction.amount;
        }
      });
      if (transaction.tags.length === 0 && transaction.amount < 0) {
        tags[-1].amount += transaction.amount;
      }
    });

    return tags;
  }

  /**
   *
   * @param {Number} param.userId
   * @param {String} param.from - format YYYY-MM-DD
   * @param {String} param.to - format YYYY-MM-DD
   * @returns
   */
  async getTransactionsCalendar({
    userId,
    from,
    to,
    groupBy = "day",
    tags,
    operationType = "expense",
  }) {
    let operationTypeFilter =
      operationType && operationType !== "all" ? {} : undefined;
    if (operationType === "expense")
      operationTypeFilter[this.sequelizeOp.lt] = 0;
    if (operationType === "income")
      operationTypeFilter[this.sequelizeOp.gt] = 0;

    const transactions = await this.transactionModel.findAll({
      include: [
        {
          model: this.sequelize.models.accounts,
          as: "account",
          duplicating: false,
        },
        tags
          ? {
              model: this.sequelize.models.tags,
              as: "tags",
              duplicating: false,
            }
          : undefined,
      ].filter((e) => e),
      attributes: [
        [
          this.sequelizeFn("SUM", this.sequelizeCol("transactions.amount")),
          "totalAmount",
        ],
        [
          this.sequelizeFn(
            "DATE",
            this.sequelizeCol("transactions.value_date")
          ),
          "day",
        ],
        [
          this.sequelizeFn(
            "STRFTIME",
            "%Y-%m",
            this.sequelizeCol("transactions.value_date")
          ),
          "month",
        ],
      ],
      where: pickBy({
        "$tags.id$": tags || undefined,
        "$account.user_id$": userId,
        date: {
          [this.sequelizeOp.gte]: from
            ? this.dayjs(from, "YYYY-MM-DD").toDate()
            : new Date(new Date().getFullYear(), 0, 1),
          [this.sequelizeOp.lte]: to
            ? this.dayjs(to, "YYYY-MM-DD").toDate()
            : new Date(),
        },
        amount: operationTypeFilter,
      }),
      group:
        groupBy === "day"
          ? [this.sequelizeCol("day")]
          : [this.sequelizeCol("month")],
      order: [["createdAt", "ASC"]],
    });

    return transactions
      .map((t) => {
        return {
          day: groupBy === "day" ? t?.dataValues?.day : undefined,
          month: groupBy === "month" ? t?.dataValues?.month : undefined,
          totalAmount: t?.dataValues?.totalAmount,
        };
      })
      .sort((a, b) => {
        if (groupBy === "day")
          return dayjs(a.day, "YYYY-MM-DD").diff(dayjs(b.day, "YYYY-MM-DD"));
        return dayjs(a.month, "YYYY-MM").diff(dayjs(b.month, "YYYY-MM"));
      });
  }

  /**
   * It calculates statistics either for the selected range or the current month
   * @param {Number} param.userId
   * @param {String} param.from - format YYYY-MM-DD
   * @param {String} param.to - format YYYY-MM-DD
   * @returns
   */
  async calculateStatistics({ userId, from, to }) {
    const monthFirstDay = `${dayjs().format("YYYY")}-${dayjs().format(
      "MM"
    )}-01`;
    const monthLastDay = `${dayjs().format("YYYY")}-${dayjs().format(
      "MM"
    )}-${leftPadding(dayjs().daysInMonth(), 2)}`;
    const data = await this.getTransactionsCalendar({
      userId,
      from: from || monthFirstDay,
      to: to || monthLastDay,
    });
    const ret = {
      mostExpensiveAmount: 0,
      mostExpensiveDay: undefined,
      leastExpensiveAmount: 99999,
      leastExpensiveDay: undefined,
      totalExpenses: 0,
      mostExpensiveMonth: undefined,
      leastExpensiveMonth: undefined,
      mostExpensiveMonthAmount: 0,
      leastExpensiveMonthAmount: 0,
      longestRow: 0,
      longestRowStart: undefined,
      longestRowEnd: undefined,
    };
    let prevDate = undefined;
    const monthAmounts = new Array(12).fill(0);
    let currentRow = 0;

    if (data?.[0]?.day !== from) {
      data.unshift({
        day: from,
        totalAmount: 0,
      });
    }
    if (data?.[data.length - 1]?.day !== to) {
      data.push({
        day: to,
        totalAmount: 0,
      });
    }
    data.forEach((d) => {
      if (Math.abs(d.totalAmount) > ret.mostExpensiveAmount) {
        ret.mostExpensiveAmount = Math.abs(d.totalAmount);
        ret.mostExpensiveDay = d.day;
      }
      if (Math.abs(d.totalAmount) < ret.leastExpensiveAmount) {
        ret.leastExpensiveAmount = Math.abs(d.totalAmount);
        ret.leastExpensiveDay = d.day;
      }
      ret.totalExpenses += Math.abs(d.totalAmount);
      monthAmounts[parseInt(dayjs(d.day, "YYYY-MM-DD").format("M"), 10) - 1] +=
        Math.abs(d.totalAmount);

      if (prevDate) {
        // only if it's a past date range, or if today is within the range, and therefore we only count days in a rows until today date
        if (dayjs(to).isBefore(dayjs) || dayjs(d.day).isBefore(dayjs())) {
          currentRow = Math.abs(dayjs(d.day).diff(prevDate, "days"));
          if (currentRow > ret.longestRow) {
            ret.longestRow = currentRow - 1;
            ret.longestRowEnd = dayjs(d.day).subtract(1, 'hour');
            ret.longestRowStart = prevDate;
          }
        }
      }
      prevDate = d.day;
    });

    ret.mostExpensiveMonthAmount = Math.max(...monthAmounts);
    ret.leastExpensiveMonthAmount = Math.min(...monthAmounts);
    ret.mostExpensiveMonth =
      monthAmounts.indexOf(ret.mostExpensiveMonthAmount) + 1;
    ret.leastExpensiveMonth =
      monthAmounts.indexOf(ret.leastExpensiveMonthAmount) + 1;
    return ret;
  }
};
