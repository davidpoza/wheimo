import Sequelize from 'sequelize';

export const definition = [
  'transactions',
  {
    emitter: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    amount: { type: Sequelize.FLOAT, allowNull: false},
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