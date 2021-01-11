import Sequelize from 'sequelize';

export const definition = [
  'users',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    name: Sequelize.TEXT,
    password: { type: Sequelize.STRING, allowNull: false},
    active: Sequelize.BOOLEAN,
    level: {
      type: Sequelize.ENUM,
      values: ['admin', 'user'],
      defaulValue: 'user',
    },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE }
  }, {
    createdAt: 'created_at',
    timestamps:true,
    underscored: true,
    updatedAt: 'updated_at'
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};