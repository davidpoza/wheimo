import { Container } from 'typedi';
import pickBy from 'lodash.pickby';

export default class RecurrentService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.recurrentModel = this.sequelize.models.recurrents;
  }

  getTemplate(t) {
    if (t) {
      return ({
        id: t.id,
        name: t.name,
        amount: t.amount,
        emitter: t.emitter,
        transactionId: t.transactionId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      });
    }
    return null;
  }

  async create({
    name,
    amount,
    emitter,
    transactionId,
    userId
  }) {
    try {
      // TODO: check if transaction is owned
      const recurrent = await this.recurrentModel.create(
        { name, amount, emitter, transactionId });
      return recurrent;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  /**
   * It only selects owned recurrents->transactions->accounts
   */
  async findAll(transactionId, userId, limit, offset, sort) {
    let filter = pickBy({ // pickBy (by default) removes undefined keys
      transactionId,
      '$transaction.account.user_id$': userId,
    });
    const recurrents = await this.recurrentModel.findAll(
      {
        where: filter,
        attributes: { exclude: ['accountId'] },
        include: {
          model: this.sequelize.models.transactions,
          include: {
            model: this.sequelize.models.accounts,
          },
        },
        limit,
        offset,
        order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ]
      });

    return recurrents.map((t) => {
      return this.getTemplate(t);
    });
  }

  /**
   * It only selects owned recurrents->transactions->accounts
   */
  async findById(id, userId, entity = false) {
    const recurrent = await this.recurrentModel.findOne({
      attributes: { exclude: ['accountId'] },
      where: {
        id,
        '$transaction.account.user_id$': userId,
      },
      include: {
        model: this.sequelize.models.transactions,
        include: {
          model: this.sequelize.models.accounts,
        },
      }
    });
    if (!recurrent) {
      return null;
    }
    if (entity) {
      return recurrent;
    }
    return this.getTemplate(recurrent.dataValues);
  }

  /**
   * It only update owned recurrents->transactions->accounts
   */
  async updateById(id, userId, values) {
    const recurrent = await this.findById(id, userId, true);
    if (recurrent) {
      const affectedRows = await this.recurrentModel.update(values, {
        where: { id },
      });
      if (affectedRows === 0) {
        return null;
      }
      const recurrent = await this.findById(id, userId, true);
      return this.getTemplate(recurrent);
    }
    return null;
  }

  async deleteById(id) {
    const affectedRows = await this.recurrentModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Recurrent payment does not exist');
    }
  }
};