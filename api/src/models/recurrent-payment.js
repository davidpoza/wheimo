import Sequelize from 'sequelize';

import Transaction from './transaction.js';
import Account from './account.js';

const RecurrentPayment = sequelize.define('recurrent-payments',
  {
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
    amount: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 }, // estimation
    emitter: { type: Sequelize.TEXT, allowNull: false},
  }
);

RecurrentPayment.belongsTo(Transaction);
RecurrentPayment.belongsTo(Account);

export default RecurrentPayment;