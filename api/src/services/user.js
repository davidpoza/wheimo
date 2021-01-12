import bcrypt from 'bcrypt';
import { Container } from 'typedi';

import config from '../config/config.js';

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
  }

  async findById(id) {
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
  }

  async deleteById(id) {
    const number = await this.sequelize.models.users.destroy({ where: { id } });
    if (number === 0) {
      throw new Error('User does not exist');
    }
  }
};