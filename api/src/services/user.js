import bcrypt from 'bcrypt';
import { Container } from 'typedi';

import config from '../config/config.js';

export default class UserService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.userModel = this.sequelize.models.users;
  }

  getTemplate(user) {
    if (user) {
      return ({
        id: user.id,
        email: user.email,
        name: user.name,
        email: user.email,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lang: user.lang,
        theme: user.theme,
      });
    }
    return null;
  }

  async create({
    email,
    name,
    password,
    active = false,
    level= 'user'
  }) {
    // each user uses its own salt for hashing password
    const salt = bcrypt.genSaltSync(config.bcryptRounds);
    const passwordHash = bcrypt.hashSync(password, salt)
    try {
      const user = await this.sequelize.models.users.create(
        { email, name, password: passwordHash, active, level });
      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll() {
    const users = await this.sequelize.models.users.findAll({  });
    return users.map((u) => {
      return (this.getTemplate(u));
    });
  }

  async findById(id) {
    const user = await this.sequelize.models.users.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    return (this.getTemplate(user));
  }

  async updateById(id, values) {
    const affectedRows = await this.sequelize.models.users.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  }

  async deleteById(id) {
    const affectedRows = await this.sequelize.models.users.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('User does not exist');
    }
  }
};