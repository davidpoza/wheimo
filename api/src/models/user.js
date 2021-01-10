import Sequelize from 'sequelize';

const User = sequelize.define('transactions',
  {
    email: { type: Sequelize.STRING, allowNull: false},
    name: Sequelize.TEXT,
    password: { type: Sequelize.STRING, allowNull: false},
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: Sequelize.DATE,
    active: Sequelize.BOOLEAN,
    level: {
      type: Sequelize.ENUM,
      values: ['admin', 'user']
    },
  }
);

export default User;