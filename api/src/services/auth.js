import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Container } from 'typedi';

import config from '../config/config.js';

export default class AuthService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.userModel = this.sequelize.models.users;
  }
  async signUp(body) {
    const { email, password, name } = body;
    const exists = await this.userModel.findOne({ where: { email, password } });
    if (exists) {
      throw new Error('User already exists');
    }
    // each user uses its own salt for hashing password
    const salt = bcrypt.genSaltSync(config.bcryptRounds);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = await this.userModel.create({ email, password: passwordHash, name, level: 'user' });
    if (!user) {
      throw new Error('Error during user creation');
    }
    this.logger.info('✅ User created');
    return user.dataValues;
  }

  async signIn(body) {
    const { email, password } = body;

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new Error('User does not exist');
    }

    const { password: passwordHash } = user.dataValues;
    if (!bcrypt.compareSync(password, passwordHash)) {
      throw new Error('Password not correct');
    }

    this.logger.info('Jwt token generation');
    const payload = {
      sub: user.id,
      exp: Math.round(Date.now()/1000) + parseInt(config.jwtLifetime),
      username: user.username
    };
    const token = jwt.sign(JSON.stringify(payload), config.jwtSecret, { algorithm: config.jwtAlgorithm });
    return ({ ...user.dataValues, token });
  }
}