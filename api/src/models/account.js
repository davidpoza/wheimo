import Sequelize from 'sequelize';

export const definition = [
  'accounts',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    number: { type: Sequelize.STRING, allowNull: false, unique: true},
    name: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    balance: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    bankId: { type: Sequelize.STRING },
    accessId: { type: Sequelize.STRING },
    accessPassword: { type: Sequelize.STRING },
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