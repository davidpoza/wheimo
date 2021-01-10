import Sequelize from 'sequelize';

import Transaction from './transaction.js';
import Rule from './rule.js';

const Tag = sequelize.define('tags',
  {
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }
);

Tag.belongsToMany(Transaction);
Tag.belongsToMany(Rule);

export default Tag;