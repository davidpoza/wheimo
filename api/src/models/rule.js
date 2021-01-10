import Sequelize from 'sequelize';

import Tag from './tag.js';

const Rule = sequelize.define('rules',
  {
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
    type: {
      type: Sequelize.ENUM,
      values: ['emitter', 'amount']
    },
    value: { type: Sequelize.STRING, allowNull: false },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }
);

Rule.belongsToMany(Tag);

export default Rule;