import Sequelize from 'sequelize';

export const definition = [
  'accounts',
  {
    number: { type: Sequelize.STRING, allowNull: false, unique: true},
    name: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    balance: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
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