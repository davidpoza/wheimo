import { Container } from 'typedi';
import bcrypt from 'bcrypt';

import config from '../config/config.js';

export default class AuthService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
  }
  async signUp(body) {
    const { email, password, name } = body;
    const exists = await this.sequelize.models.users.findOne({ where: { email, password } });
    if (exists) {
      throw new Error('User already exists');
    }
    const passwordHash = bcrypt.hashSync(password, config.bcryptRounds);
    const user = await this.sequelize.models.users.create({ email, password: passwordHash, name });
    if (!user) {
      throw new Error('Error during user creation');
    }
    this.logger.info("✅ User created");
    return user.dataValues;
  }
}