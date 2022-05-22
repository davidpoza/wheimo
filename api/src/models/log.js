import Sequelize from 'sequelize';

export const definition = [
  'logs',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    ip: { type: Sequelize.STRING },
    location: { type: Sequelize.STRING },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
  }, {
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};