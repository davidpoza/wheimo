import Sequelize from 'sequelize';

export const definition = [
  'transactions',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    emitter: { type: Sequelize.TEXT, allowNull: false},
    emitterName: { type: Sequelize.TEXT, allowNull: true},
    description: Sequelize.TEXT,
    amount: { type: Sequelize.FLOAT, allowNull: false},
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