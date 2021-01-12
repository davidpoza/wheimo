import Sequelize from 'sequelize';

export const definition = [
  'recurrentPayments',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
    amount: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 }, // estimation
    emitter: { type: Sequelize.TEXT, allowNull: false},
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE }
  }, {
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};