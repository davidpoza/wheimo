import Sequelize from 'sequelize';

export const definition = [
  'recurrentPayments',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
    amount: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 }, // estimation
    emitter: { type: Sequelize.TEXT, allowNull: false},
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