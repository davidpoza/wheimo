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
  }) {
    try {
      const recurrent = await this.recurrentModel.create(
        { name, amount, emitter, transactionId });
      return recurrent;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(transactionId, userId, limit, offset, sort) {
    let filter = pickBy({ // pickBy (by default) removes undefined keys
      transactionId
    });
    const recurrents = await this.recurrentModel.findAll(
      {
        attributes: { exclude: ['accountId'] },
        limit,
        offset,
        where: filter,
        order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ]
      });

    return recurrents.map((t) => {
      return this.getTemplate(t);
    });
  }

  async findById(id, userId, entity = false) {
    const recurrent = await this.recurrentModel.findOne({
      attributes: { exclude: ['accountId'] },
      where: { id }
    });
    if (!recurrent) {
      return null;
    }
    if (entity) {
      return recurrent;
    }
    return this.getTemplate(recurrent.dataValues);
  }

  async updateById(id, values) {
    const affectedRows = await this.recurrentModel.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    const recurrent = await this.findById(id, true);
    return this.getTemplate(recurrent);
  }

  async deleteById(id) {
    const affectedRows = await this.recurrentModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Recurrent payment does not exist');
    }
  }
};