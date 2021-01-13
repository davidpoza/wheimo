import Sequelize from 'sequelize';
/**
 * I don't know why I need to use underscored names to achieve fieldnames to be underscored
 * since underscored=true, but it seems to ignore it
 */

export const definition = [
  'appliedRules',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    rule_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'rules',
        key: 'id'
      }
    },
    tag_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      }
    },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE }
  }, {
    underscored: true,
    timestamps:true,
  }
];

export default (sequelize) => {
  sequelize.define(...definition);
};