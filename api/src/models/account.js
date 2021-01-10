import Sequelize from 'sequelize';

import RecurrentPayment from './recurrent-payment.js';
import Transaction from './transaction.js';

const Account = sequelize.define('accounts',
  {
    number: { type: Sequelize.STRING, allowNull: false, unique: true},
    name: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    balance: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }
);

Account.hasMany(Transaction);
Account.hasMany(RecurrentPayment);

export default Account;