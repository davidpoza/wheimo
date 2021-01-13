import Sequelize from 'sequelize';

export const definition = [
  'tagged',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    transactionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id'
      }
    },
    tagId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      }
    },
  },
];

export default (sequelize) => {
  sequelize.define(...definition);
};