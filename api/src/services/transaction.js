import { Container } from 'typedi';


export default class TransactionService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.transactionModel = this.sequelize.models.transactions;
  }
  async create({
    emitter,
    emitterName,
    description,
    amount,
    accountId,
  }) {
    try {
      const transaction = await this.transactionModel.create(
        { emitter, emitterName, description, amount, accountId });
      return transaction;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(accountId) {
    let transactions;
    if (accountId) {
      transactions = await this.transactionModel.findAll({ where: { accountId } });
    } else {
      transactions = await this.transactionModel.findAll();
    }
    return transactions.map((t) => {
      return ({
        id: t.id,
        emitter: t.emitter,
        emitterName: t.emitterName,
        description: t.description,
        amount: t.amount,
        accountId: t.accountId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      });
    });
  }

  async findById(id) {
    const transaction = await this.transactionModel.findOne({ where: { id } });
    if (!transaction) {
      return null;
    }
    return ({
      id: transaction.dataValues.id,
      emitter: transaction.dataValues.emitter,
      emitterName: transaction.dataValues.emitterName,
      description: transaction.dataValues.description,
      amount: transaction.dataValues.amount,
      accountId: transaction.dataValues.accountId,
      createdAt: transaction.dataValues.createdAt,
      updatedAt: transaction.dataValues.updatedAt,
    });
  }

  async updateById(id, values) {
    const affectedRows = await this.transactionModel.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  }

  async deleteById(id) {
    const affectedRows = await this.transactionModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Transaction does not exist');
    }
  }
};