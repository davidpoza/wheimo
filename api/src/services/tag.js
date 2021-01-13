import { Container } from 'typedi';


export default class TagService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.tagModel = this.sequelize.models.tags;
  }

  getTemplate(t) {
    return ({
      id: t.id,
      name: t.name,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    });
  }

  async create({
    name, rules
  }) {
    let assRules;
    try {
      const tag = await this.tagModel.create({ name });
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

  async findAll(limit, offset, sort) {
    const tags = await this.tagModel.findAll(
      { limit, offset, order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ] });;

    return tags.map((t) => {
      return (this.getTemplate(t));
    });
  }

  async findById(id) {
    const tag = await this.tagModel.findOne({ where: { id } });
    if (!tag) {
      return null;
    }
    return (this.getTemplate(tag.dataValues));
  }

  async updateById(id, values) {
    const affectedRows = await this.tagModel.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  }

  async deleteById(id) {
    const affectedRows = await this.tagModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Tag does not exist');
    }
  }
};