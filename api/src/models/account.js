import Sequelize from 'sequelize';

export const definition = [
  'accounts',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    number: { type: Sequelize.STRING, allowNull: false, unique: true},
    name: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    balance: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
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