import { Container } from 'typedi';
import pickBy from 'lodash.pickby';

export default class BudgetService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.dayjs = Container.get('dayjs');
    this.budgetModel = this.sequelize.models.budgets;
    this.tagModel = this.sequelize.models.tags;
  }

  getTemplate(budget) {
    if (budget) {
      return ({
        id: budget.id,
        value: budget.value,
        start: this.dayjs(budget.start).format('YYYY-MM-DD'),
        end: this.dayjs(budget.end).format('YYYY-MM-DD'),
        tag: {
          id: budget.tag.id,
          name: budget.tag.name
        },
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      });
    }
  }

  /**
   * Creates budget if tag is owned by user
   * @param {Object} param
   * @param {number} param.value - limit amount of the budget
   * @param {string} param.start - start date of period for the budget, in YYYY-MM-DD format
   * @param {string} param.end - end date of period for the budget, in YYYY-MM-DD format
   * @param {number} param.tagId - identifier of tag associated to budget
   * @param {number} param.userId - identifier of user creating budget, it must match with tag owner
   */
  async create({
    value, start, end, tagId, userId
  }) {
    try {
      const tag = await this.tagModel.findOne({ where: { id: tagId, userId } });
      if (!tag) {
        const notFound = new Error('tag not found');
        notFound.name = 'notfound';
        throw notFound;
      }
      const startDate = this.dayjs(start, 'YYYY-MM-DD').toDate();
      const endDate = this.dayjs(end, 'YYYY-MM-DD').toDate();
      const budget = await this.budgetModel.create({ value, tagId, start: startDate, end: endDate });
      return { budget };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  /**
   * Fetches all budgets owned by user. And applies defined filters if any.
   * @param {Object} param
   * @param {number} param.userId - owner user identifier
   * @param {number} param.tagId - filter by associated tag identifier
   * @param {number} param.limit - query limit
   * @param {number} param.offset - query offset
   * @param {string} param.sort - query sorting by createdAt column
   */
  async findAll({ userId, tagId, limit, offset, sort }) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      '$tag.user_id$': userId,
      '$tag.id$': tagId,
    });
    const budgets = await this.budgetModel.findAll(
      {
        where: filter,
        include: { model: this.sequelize.models.tags, as: 'tag' } ,
        limit,
        offset,
        order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ]
      }
    );

    return budgets.map((budget) => {
      return (this.getTemplate(budget));
    });
  }

  /**
   * Fetches budget by id if it's owned by user.
   * @param {Object} param
   * @param {number} param.id - budget identifier
   * @param {number} param.userId - owner user identifier
   * @param {boolean} param.entity - flag set true for returning an sequelize entity object or plain object if set to false
   */
  async findById({ id, userId, entity = false }) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      '$tag.user_id$': userId
    });
    const budget = await this.budgetModel.findOne({
      include: { model: this.sequelize.models.tags, as: 'tag' } ,
      where: filter
    });
    if (!budget) {
      return null;
    }
    if (entity) {
      return budget;
    }
    return (this.getTemplate(budget.dataValues));
  }

  async updateById(id, userId, values) {
    let budget = this.findById({ id, userId });
    if (budget) {
      const affectedRows = await this.budgetModel.update(values, { where: { id } });
      if (affectedRows === 0) {
        return null;
      }
      budget = await this.findById({ id, userId, entity: true });
      return this.getTemplate(budget);
    }
    return null;
  }

  /**
   * Deletes budget if it's owned by user
   * @param {number} id - budget identifier
   * @param {number} userId - owner user identifier
   */
  async deleteById(id, userId) {
    const budget = this.findById({ id, userId });
    if (budget) {
      const affectedRows = await this.budgetModel.destroy({ where: { id } });
      if (affectedRows === 0) {
        throw new Error('Budget does not exist');
      }
    }
    return null;
  }
};