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
      type: Sequelize.ENUM('user', 'admin'),
      defaulValue: 'user',
      allowNull: false,
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