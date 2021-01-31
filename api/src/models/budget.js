import Sequelize from 'sequelize';

export const definition = [
  'budgets',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    value: { type: Sequelize.FLOAT, allowNull: false },
    start: { type: Sequelize.DATE, allowNull: false  },
    end: { type: Sequelize.DATE, allowNull: false  },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE },
    tagId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
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
