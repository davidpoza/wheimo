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
