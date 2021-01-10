import Sequelize from 'sequelize';

export const definition = [
  'users',
  {
    email: { type: Sequelize.STRING, allowNull: false},
    name: Sequelize.TEXT,
    password: { type: Sequelize.STRING, allowNull: false},
    active: Sequelize.BOOLEAN,
    level: {
      type: Sequelize.ENUM,
      values: ['admin', 'user']
    },
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