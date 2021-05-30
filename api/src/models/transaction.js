import Sequelize from 'sequelize';

export const definition = [
  'transactions',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    importId: { type: Sequelize.TEXT }, // to differentiate between same transaction imported twice
    receipt: { type: Sequelize.BOOLEAN, defaultValue: false },
    emitterName: { type: Sequelize.TEXT, allowNull: true },
    receiverName: { type: Sequelize.TEXT, allowNull: true },
    description: Sequelize.TEXT,
    comments: Sequelize.TEXT,
    assCard: { type: Sequelize.TEXT, allowNull: true },
    amount: { type: Sequelize.FLOAT, allowNull: false },
    currency: { type: Sequelize.TEXT, allowNull: false },
    date: { type: Sequelize.DATE },
    valueDate: { type: Sequelize.DATE },
    favourite: { type: Sequelize.BOOLEAN, defaultValue: false },
    balance: { type: Sequelize.FLOAT, defaultValue: 0.0 },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE },
    accountId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts',
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