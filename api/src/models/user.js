import Sequelize from 'sequelize';

export const definition = [
  'users',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    name: Sequelize.TEXT,
    password: { type: Sequelize.STRING, allowNull: false },
    active: { type: Sequelize.BOOLEAN, defaultValue: false },
    level: {
      type: Sequelize.STRING,
      validate: { // sqlite doesnt support ENUM
        isIn: [['user', 'admin']],
      },
      defaulValue: 'user',
      allowNull: false,
    },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE }
  }, {
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};