import Sequelize from 'sequelize';

export default (sequelize) => {
  sequelize.define('transactions',
    {
      emitter: { type: Sequelize.TEXT, allowNull: false},
      description: Sequelize.TEXT,
      amount: { type: Sequelize.FLOAT, allowNull: false},
    }, {
      createdAt: 'created_at',
      timestamps:true,
      underscored: true,
      updatedAt: 'updated_at'
    }
  );
};