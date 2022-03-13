import { Container } from 'typedi';
import pickBy from 'lodash.pickby';

export default class TagService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.tagModel = this.sequelize.models.tags;
    this.transactionService = Container.get('transactionService');
  }

  getTemplate(tag) {
    if (tag) {
      return ({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        rules: tag.rules && tag.rules.map(rule => ({
          id: rule.id,
          name: rule.name,
          type: rule.type,
          value: rule.value,
          tags: [
            {
              id: tag.id,
              name: tag.name,
            }
          ]
        }))
      });
    }
  }

  /**
   * Creates a tag
   * @param {Object} param
   * @param {string} param.name - name for tag
   * @param {number} param.userId - owner user identifier
   * @param {Array<number>} param.rules - array of rules identifiers
   */
  async create({
    name, rules = [], userId
  }) {
    let assRules;
    try {
      const tag = await this.tagModel.create({ name, userId });
      // associates rules
      if (rules) {
        assRules = await tag.setRules(rules);
      }
      return { ...tag.dataValues, rules: assRules };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  /**
   * Fetches all tags owned by user
   * @param {Object} param
   * @param {number} param.userId - owner user identifier
   * @param {number} param.limit - query limit
   * @param {number} param.offset - query offset
   * @param {string} param.sort - asc/desc sorting by createdAt column
   */
  async findAll({ userId, limit, offset, sort = 'desc', orderBy = 'createdAt' }) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      userId
    });
    const tags = await this.tagModel.findAll(
      {
        where: filter,
        include: { model: this.sequelize.models.rules, as: 'rules' } ,
        limit,
        offset,
        order: [ [orderBy, sort === 'asc' ? 'ASC' : 'DESC'] ]
      }
    );

    return tags.map((t) => {
      return (this.getTemplate(t));
    });
  }

  /**
   * Fetches one tag owned by user
   * @param {Object} param
   * @param {number} param.id - tag identifier
   * @param {number} param.userId - owner user identifier
   * @param {boolean} param.entity - flag set true for returning an sequelize entity object or plain object if set to false
   */
  async findById({ id, userId, entity = false }) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId
    });
    const tag = await this.tagModel.findOne({
      include: { model: this.sequelize.models.rules, as: 'rules' } ,
      where: filter
    });
    if (!tag) {
      return null;
    }
    if (entity) {
      return tag;
    }
    return (this.getTemplate(tag.dataValues));
  }

  async updateById(id, userId, values) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId,
    });
    const affectedRows = await this.tagModel.update(values, { where: filter });
    if (affectedRows === 0) {
      return null;
    }
    let tag = await this.findById({ id, userId, entity: true });

    if (values.rules) {
      await tag.setRules(values.rules);
      tag = await this.findById({ id, userId, entity:true });
    }

    return this.getTemplate(tag);
  }s

  async deleteById(id, userId) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId,
    });
    const affectedRows = await this.tagModel.destroy({ where: filter });
    if (affectedRows === 0) {
      throw new Error('Tag does not exist');
    }
  }
};