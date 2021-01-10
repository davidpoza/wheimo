import { Container } from 'typedi';

export default class UserService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
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
      console.log(err)
    }
  }
};
