import { Container } from 'typedi';


export default class TransactionService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.transactionModel = this.sequelize.models.transactions;
  }

  getTemplate(t) {
    return ({
      id: t.id,
      emitter: t.emitter,
      emitterName: t.emitterName,
      description: t.description,
      amount: t.amount,
      accountId: t.accountId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      tags: t.tags.map(tag => ({
        id: tag.id,
        name: tag.name
      }))
    });
  }

  async create({
    emitter,
    emitterName,
    description,
    amount,
    accountId,
    tags
  }) {
    let assTags;
    try {
      const transaction = await this.transactionModel.create(
        { emitter, emitterName, description, amount, accountId });
      // associates tags
      if (tags) {
        assTags = await transaction.setTags(tags);
      }
      return { ...transaction.dataValues, tags: assTags };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(accountId, limit, offset, sort) {
    let transactions;
    if (accountId) {
      transactions = await this.transactionModel.findAll(
        { include: this.sequelize.models.tags, limit, offset, where: { accountId }, order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ] });
    } else {
      transactions = await this.transactionModel.findAll(
        { include: this.sequelize.models.tags, limit, offset, order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ] });
    }
    return transactions.map((t) => {
      return this.getTemplate(t);
    });
  }

  async findById(id, entity = false) {
    const transaction = await this.transactionModel.findOne({
      where: { id },
      include: this.sequelize.models.tags
    });
    if (!transaction) {
      return null;
    }
    if (entity) {
      return transaction;
    }
    return this.getTemplate(transaction.dataValues);
  }

  async updateById(id, values) {
    const affectedRows = await this.transactionModel.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    let transaction = await this.findById(id, true);

    if (values.tags) {
      await transaction.setTags(values.tags);
      transaction = await this.findById(id, true);
    }

    return this.getTemplate(transaction);
  }

  async deleteById(id) {
    const affectedRows = await this.transactionModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Transaction does not exist');
    }
  }
};