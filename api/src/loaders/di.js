import { Container } from 'typedi';

export default ({ sequelize, logger }) => {
  Container.set('sequelizeInstance', sequelize);
  Container.set('loggerInstance', logger);
}