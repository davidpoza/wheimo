import Sequelize from 'sequelize';

export default (sequelize) => {
  sequelize.define('recurrentPayments',
    {
      name: { type: Sequelize.STRING, allowNull: false, unique: true},
      amount: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0.0 }, // estimation
      emitter: { type: Sequelize.TEXT, allowNull: false},
    }, {
      createdAt: 'created_at',
      timestamps:true,
      underscored: true,
      updatedAt: 'updated_at'
    }
  );
};