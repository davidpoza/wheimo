import { Container } from 'typedi';


export default class TagService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.tagModel = this.sequelize.models.tags;
  }
  async create({
    name
  }) {
    try {
      const tag = await this.tagModel.create({ name });
      return tag;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(limit, offset, sort) {
    const tags = await this.tagModel.findAll(
      { limit, offset, order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ] });;

    return tags.map((t) => {
      return ({
        id: t.id,
        name: t.name,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      });
    });
  }

  async findById(id) {
    const tag = await this.tagModel.findOne({ where: { id } });
    if (!tag) {
      return null;
    }
    return ({
      id: tag.dataValues.id,
      name: tag.dataValues.name,
      createdAt: tag.dataValues.createdAt,
      updatedAt: tag.dataValues.updatedAt,
    });
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