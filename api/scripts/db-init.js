import Sequelize from 'sequelize';
import sequelizeLoader from '../src/loaders/sequelize.js';
import { definition as userDefinition } from '../src/models/user.js';

const sequelize = sequelizeLoader.newConnection();
const queryInterface = sequelize.getQueryInterface();

queryInterface.createTable(...userDefinition);