import Sequelize from 'sequelize';

export const definition = [
  'transactions',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    emitter: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    amount: { type: Sequelize.FLOAT, allowNull: false},
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