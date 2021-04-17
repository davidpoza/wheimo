import Sequelize from 'sequelize';

export const definition = [
  'attachments',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: Sequelize.TEXT, allowNull: true },
    filename: { type: Sequelize.TEXT, allowNull: false },
    type: { type: Sequelize.TEXT, allowNull: false },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE },
    transactionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
  }, {
    timestamps:true,
    underscored: true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};