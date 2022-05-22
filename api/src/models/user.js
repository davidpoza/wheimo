import Sequelize from 'sequelize';

export const definition = [
  'users',
  {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    email: {type: Sequelize.STRING, allowNull: false, unique: true},
    name: Sequelize.TEXT,
    password: {type: Sequelize.STRING, allowNull: false},
    active: {type: Sequelize.BOOLEAN, defaultValue: false},
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'en',
      validate: {
        // sqlite doesnt support ENUM
        isIn: [['en', 'es']],
      },
    },
    ignoredTagId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'tags',
        key: 'id'
      }
    },
    theme: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'light',
      validate: {
        // sqlite doesnt support ENUM
        isIn: [['light', 'dark']],
      },
    },
    level: {
      type: Sequelize.STRING,
      validate: {
        // sqlite doesnt support ENUM
        isIn: [['user', 'admin']],
      },
      defaulValue: 'user',
      allowNull: false,
    },
    createdAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    updatedAt: {type: Sequelize.DATE},
  },
  {
    timestamps: true,
  },
];

export default (sequelize) => {
  sequelize.define(...definition);
};