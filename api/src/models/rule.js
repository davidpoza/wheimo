import Sequelize from 'sequelize';

export default (sequelize) => {
  sequelize.define('rules',
    {
      name: { type: Sequelize.STRING, allowNull: false, unique: true},
      type: {
        type: Sequelize.ENUM,
        values: ['emitter', 'amount']
      },
      value: { type: Sequelize.STRING, allowNull: false },
    }, {
      createdAt: 'created_at',
      timestamps:true,
      underscored: true,
      updatedAt: 'updated_at'
    }
  );
};
