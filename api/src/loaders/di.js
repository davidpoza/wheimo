import { Container } from 'typedi';

export default ({ sequelize }) => {
  Container.set('sequelizeInstance', sequelize);
}