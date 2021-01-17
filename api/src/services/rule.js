import { Container } from 'typedi';
import pickBy from 'lodash.pickby';

export default class RuleService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.ruleModel = this.sequelize.models.rules;
  }

  getTemplate(rule) {
    return ({
      id: rule.id,
      name: rule.name,
      type: rule.type,
      value: rule.value,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    });
  }

  async create({
    name, type, value, userId
  }) {
    try {
      const rule = await this.ruleModel.create({ name, type, value, userId });
      return rule;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(userId, limit, offset, sort) {
    const rules = await this.ruleModel.findAll(
      {
        where: { userId },
        limit,
        offset,
        order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ]
      }
    );

    return rules.map((t) => {
      return (this.getTemplate(t));
    });
  }

  async findById(id, userId) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId,
    });
    const rule = await this.ruleModel.findOne({ where: filter });
    if (!rule) {
      return null;
    }
    return (this.getTemplate(rule.dataValues));
  }

  async updateById(id, userId, values) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId,
    });
    const affectedRows = await this.ruleModel.update(values, { where: filter });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id, userId);
  }

  async deleteById(id) {
    const affectedRows = await this.ruleModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Rule does not exist');
    }
  }
};