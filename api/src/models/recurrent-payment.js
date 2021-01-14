import Sequelize from 'sequelize';

export const definition = [
  'recurrents',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    amount: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 }, // estimation
    emitter: { type: Sequelize.TEXT, allowNull: false },
    transactionId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'transactions',
        key: 'id'
      }
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