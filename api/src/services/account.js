import bcrypt from 'bcrypt';
import { Container } from 'typedi';

import config from '../config/config.js';

export default class AccountService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.userModel = this.sequelize.models.users;
  }
  async create({
    number,
    name,
    description,
  }) {
    try {
      const account = await this.sequelize.models.accounts.create(
        { number, name, description });
      return account;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll() {
    const accounts = await this.sequelize.models.accounts.findAll({  });
    return accounts.map((u) => {
      return ({
        id: u.id,
        number: u.number,
        name: u.name,
        description: u.description,
        balance: u.balance,
        created_at: u.created_at,
        updated_at: u.updated_at,
      });
    });
  }

  async findById(id) {
    const account = await this.sequelize.models.accounts.findOne({ where: { id } });
    if (!account) {
      return null;
    }
    return ({
      id: account.dataValues.id,
      number: account.dataValues.number,
      name: account.dataValues.name,
      description: account.dataValues.description,
      balance: account.dataValues.balance,
      created_at: account.dataValues.created_at,
      updated_at: account.dataValues.updated_at,
    });
  }

  async updateById(id, values) {
    const affectedRows = await this.sequelize.models.accounts.update(values, { where: { id } });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  }

  async deleteById(id) {
    const affectedRows = await this.sequelize.models.accounts.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Account does not exist');
    }
  }
};