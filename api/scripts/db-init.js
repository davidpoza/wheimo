import Sequelize from 'sequelize';
import sequelizeLoader from '../src/loaders/sequelize.js';

const sequelize = sequelizeLoader.newConnection();
const queryInterface = sequelize.getQueryInterface();

queryInterface.createTable('User', {
  name: Sequelize.STRING,
  isBetaMember: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});