import Sequelize from 'sequelize';

export const definition = [
  'rules',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true},
    type: {
      type: Sequelize.STRING,
      validate: { // sqlite doesnt support ENUM
        isIn: [['emitterName', 'amount', 'card', 'receipt', 'account']],
      },
      allowNull: false,
    },
    value: { type: Sequelize.STRING, allowNull: false },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
  }, {
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};
