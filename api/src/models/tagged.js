import Sequelize from 'sequelize';
/**
 * I don't know why I need to use underscored names to achieve fieldnames to be underscored
 * since underscored=true, but it seems to ignore it
 */

export const definition = [
  'tagged',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    transaction_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'transactions',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    tag_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'tags',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE },
  }, {
    underscored: true,
    timestamps:true,
    tableName: 'tagged'
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};