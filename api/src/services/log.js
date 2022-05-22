import { Container } from 'typedi';
import fetch from 'node-fetch';
import dayjs from 'dayjs';

export default class LogService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.logModel = this.sequelize.models.logs;
    this.getTemplate = this.getTemplate.bind(this);
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  getTemplate(l) {
    return ({
      id: l.id,
      ip: l.ip,
      location: l.location,
      userId: l.userId,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    });
  }

  async create({
    ip,
    userId,
  }) {
    try {
      const reqgeoip = await fetch(`http://ipwho.is/${ip}`);
      const jsongeoip = await reqgeoip.json();

      const log = await this.logModel.create(
        {
          ip,
          userId,
          location: jsongeoip?.success ? `${jsongeoip?.city}-${jsongeoip?.country_code}` : ''
        });
      return log;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(userId) {
    const logs = await this.logModel.findAll({
      where: {
        userId,
        createdAt: {
          [this.sequelize.Sequelize.Op.gt]: dayjs().subtract(30, 'days').toDate(),
        }
      },
      order: [['createdAt', 'DESC']],
     });
    return logs.map((a) => {
      return (this.getTemplate(a));
    });
  }


  async deleteById(id, userId) {
    const affectedRows = await this.logModel.destroy({ where: { id, userId } });
    if (affectedRows === 0) {
      throw new Error('Log does not exist');
    }
  }

};
