import Sequelize from 'sequelize';

export const definition = [
  'rules',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
    type: {
      type: Sequelize.ENUM,
      values: ['emitter', 'amount']
    },
    value: { type: Sequelize.STRING, allowNull: false },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE }
  }, {
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};
