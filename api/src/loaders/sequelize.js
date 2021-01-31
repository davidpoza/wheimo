import Sequelize from 'sequelize';

import config from '../config/config.js';
import applyExtraSetup from '../models/extra-setup.js';

import User from '../models/user.js';
import Transaction from '../models/transaction.js';
import Tag from '../models/tag.js';
import Account from '../models/account.js';
import Rule from '../models/rule.js';
import RecurrentPayment from '../models/recurrent-payment.js';
import Budget from '../models/budget.js';

let sequelize;
export default {
  newConnection: () => {
    sequelize = new Sequelize(config.db.dbname, config.db.username, config.db.password, config.db.params);

    const modelDefiners = [
      User,
      Transaction,
      Tag,
      Account,
      Rule,
      RecurrentPayment,
      Budget
    ];
    // We define all models according to their files.
    for (const modelDefiner of modelDefiners) {
      modelDefiner(sequelize);
    }
    // We execute any extra setup after the models are defined, such as adding associations.
    applyExtraSetup(sequelize);

    sequelize
      .authenticate()
      .then(() => {
          console.log('Connection has been established successfully.');
      })
      .catch(err => {
          console.error('Unable to connect to the database:', err);
      });
    return sequelize;
  },
  getConnection: () => {
    return sequelize;
  }
}