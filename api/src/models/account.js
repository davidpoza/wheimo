import Sequelize from 'sequelize';

/**
 * bankId: id used to select correct importer
 * settings: bank depending options, used by importer
 */
export const definition = [
  'accounts',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    number: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    balance: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 },
    savingTargetAmount: { type: Sequelize.FLOAT },
    savingInitialAmount: { type: Sequelize.FLOAT },
    savingAmountFunc: { type: Sequelize.TEXT },
    savingFrequency: { type: Sequelize.TEXT },
    bankId: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['opbk', 'wallet', 'piggybank']],
      },
      allowNull: false,
    },
    savingInitDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    savingTargetDate: { type: Sequelize.DATE },
    accessId: { type: Sequelize.STRING },
    accessPassword: { type: Sequelize.STRING },
    lastSyncCount: { type: Sequelize.INTEGER, defaultValue: 0 },
    settings: { type: Sequelize.JSON },
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