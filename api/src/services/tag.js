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
      rules: t.rules.map(rule => ({
        id: rule.id,
        name: rule.name,
        type: rule.type,
        value: rule.value,
      }))
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
      {
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

  async findById(id, entity = false) {
    const tag = await this.tagModel.findOne({
      include: { model: this.sequelize.models.rules, as: 'rules' } ,
      where: { id }
    });
    if (!tag) {
      return null;
    }
    if (entity) {
      return tag;
    }
    return (this.getTemplate(tag.dataValues));
  }

  async updateById(id, values) {
    const affectedRows = await this.tagModel.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    let tag = await this.findById(id, true);

    if (values.rules) {
      await tag.setRules(values.rules);
      tag = await this.findById(id, true);
    }

    return this.getTemplate(tag);
  }

  async deleteById(id) {
    const affectedRows = await this.tagModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Tag does not exist');
    }
  }
};