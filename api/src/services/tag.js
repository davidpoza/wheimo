import { Container } from 'typedi';
import pickBy from 'lodash.pickby';

export default class TagService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.tagModel = this.sequelize.models.tags;
    this.transactionService = Container.get('transactionService');
  }

  getTemplate(t) {
    if (t) {
      return ({
        id: t.id,
        name: t.name,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        rules: t.rules && t.rules.map(rule => ({
          id: rule.id,
          name: rule.name,
          type: rule.type,
          value: rule.value,
        }))
      });
    }
  }

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

  async findAll(userId, limit, offset, sort) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      userId
    });
    const tags = await this.tagModel.findAll(
      {
        where: filter,
        include: { model: this.sequelize.models.rules, as: 'rules' } ,
        limit,
        offset,
        order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ]
      }
    );

    return tags.map((t) => {
      return (this.getTemplate(t));
    });
  }

  async findById(id, userId, entity = false) {
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
    let tag = await this.findById(id, userId, true);

    if (values.rules) {
      await tag.setRules(values.rules);
      tag = await this.findById(id, userId, true);
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