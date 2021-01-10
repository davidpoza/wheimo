import Sequelize from 'sequelize';

export const definition = [
  'tags',
  {
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
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