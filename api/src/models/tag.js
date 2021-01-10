import Sequelize from 'sequelize';

export default (sequelize) => {
  sequelize.define('tags',
    {
      name: { type: Sequelize.STRING, allowNull: false, unique: true},
    }, {
      createdAt: 'created_at',
      timestamps:true,
      underscored: true,
      updatedAt: 'updated_at'
    }
  );
};