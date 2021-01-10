import Sequelize from 'sequelize';

import Account from './account.js';
import Tag from './tag.js';

const Transaction = sequelize.define('transactions',
  {
    emitter: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    amount: { type: Sequelize.FLOAT, allowNull: false},
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }
);

Transaction.belongsTo(Account);
Transaction.belongsToMany(Tag);

export default Transaction;