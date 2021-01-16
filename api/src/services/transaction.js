import { Container } from 'typedi';
import pickBy from 'lodash.pickby';
import dayjs from 'dayjs';
export default class TransactionService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.transactionModel = this.sequelize.models.transactions;
    this.accountService = Container.get('accountService');
  }

  getTemplate(t) {
    if (t) {
      return ({
        id: t.id,
        receipt: t.receipt,
        emitterName: t.emitterName,
        description: t.description,
        amount: t.amount,
        currency: t.currency,
        date: t.date,
        valueDate: t.valueDate,
        accountId: t.accountId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        tags: t.tags.map(tag => ({
          id: tag.id,
          name: tag.name
        }))
      });
    }
    return null;
  }

  /**
    * It only creates transactions in within owned accounts
    * @param {Object} params
    * @param {string} params.date - date in format YYYY-MM-DD
    * @param {string} params.valueDate - value date in format YYYY-MM-DD
    */
  async create({
    receipt,
    emitterName,
    description,
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
            description,
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
   */
  async findAll(accountId, userId, tags, limit, offset, sort) {
    let filter = pickBy({ // pickBy (by default) removes undefined keys
      accountId,
      '$tags.id$': tags,
      '$account.user_id$': userId,
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
  async findById(id, userId, entity = false) {
    const transaction = await this.transactionModel.findOne({
      where: {
        id,
        '$account.user_id$': userId,
      },
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
    let transaction = this.findById(id, userId);
    if (transaction) {
      const affectedRows = await this.transactionModel.update(values, { where: { id } });
      if (affectedRows === 0) {
        return null;
      }
      transaction = await this.findById(id, userId, true);

      if (values.tags) {
        await transaction.setTags(values.tags);
        transaction = await this.findById(id, true);
      }

      return this.getTemplate(transaction);
    }
    return null;
  }

  /**
   * It only deletes owned transactions->accounts
   */
  async deleteById(id, userId) {
    const transaction = this.findById(id, userId);
    if (transaction) {
      const affectedRows = await this.transactionModel.destroy({ where: { id } });
      if (affectedRows === 0) {
        throw new Error('Transaction does not exist');
      }
    }
    return null;
  }
};