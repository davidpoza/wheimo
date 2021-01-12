import bcrypt from 'bcrypt';
import { Container } from 'typedi';

import config from '../config/config.js';

export default class AccountService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.accountModel = this.sequelize.models.accounts;
  }
  async create({
    number,
    name,
    description,
    userId
  }) {
    try {
      const account = await this.accountModel.create(
        { number, name, description, userId });
      return account;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(userId) {
    const accounts = await this.accountModel.findAll({ where: { userId } });
    return accounts.map((a) => {
      return ({
        id: a.id,
        number: a.number,
        name: a.name,
        description: a.description,
        balance: a.balance,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      });
    });
  }

  async findById(id, userId) {
    const account = await this.accountModel.findOne({ where: { id, userId } });
    if (!account) {
      return null;
    }
    return ({
      id: account.dataValues.id,
      number: account.dataValues.number,
      name: account.dataValues.name,
      description: account.dataValues.description,
      balance: account.dataValues.balance,
      createdAt: account.dataValues.createdAt,
      updatedAt: account.dataValues.updatedAt,
    });
  }

  async updateById(id, userId, values) {
    const affectedRows = await this.accountModel.update(values, { where: { id, userId } });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id, userId);
  }

  async deleteById(id, userId) {
    const affectedRows = await this.accountModel.destroy({ where: { id, userId } });
    if (affectedRows === 0) {
      throw new Error('Account does not exist');
    }
  }
};