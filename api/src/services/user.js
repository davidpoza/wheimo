import e from 'express';
import { Container } from 'typedi';

export default class UserService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.userModel = this.sequelize.models.users;
  }
  async create({
    email,
    name,
    password,
    active,
    level
  }) {
    try {
      await this.sequelize.models.users.create({ email, name, password, active, level });
    } catch (err) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll() {
    try {
      const users = await this.sequelize.models.users.findAll({  });
      return users.map((u) => {
        return ({
          id: u.id,
          name: u.name,
          level: u.level,
          email: u.email,
          active: u.active,
          created_at: u.created_at,
          updated_at: u.updated_at,
        });
      });
    } catch (err) {
      this.logger.error(e);
      throw e;
    }
  }

  async findById(id) {
    try {
      const user = await this.sequelize.models.users.findOne({ where: { id } });
      if (!user) {
        return null;
      }
      return ({
        id: user.dataValues.id,
        name: user.dataValues.name,
        level: user.dataValues.level,
        email: user.dataValues.email,
        active: user.dataValues.active,
        created_at: user.dataValues.created_at,
        updated_at: user.dataValues.updated_at,
      });
    } catch (err) {
      this.logger.error(e);
      throw e;
    }
  }
};