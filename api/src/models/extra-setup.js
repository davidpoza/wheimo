// this file will define associations after all models have been defined.function applyExtraSetup(sequelize) {
export default function applyExtraSetup(sequelize) {
  const { users, accounts, transactions, tags, rules, recurrents, budgets } = sequelize.models;

  accounts.hasMany(transactions);
  accounts.hasMany(recurrents);
  accounts.belongsTo(users);

  recurrents.belongsTo(transactions);
  recurrents.belongsTo(accounts);

  tags.belongsToMany(transactions, { through: 'tagged' });
  tags.belongsToMany(rules, { through: 'appliedRules' });
  tags.belongsTo(users);
  tags.hasMany(budgets);

  transactions.belongsTo(accounts);
  transactions.belongsToMany(tags, { through: 'tagged', onDelete: 'cascade', hooks:true });

  users.hasMany(accounts);
  users.hasMany(rules);
  users.hasMany(tags);

  rules.belongsToMany(tags, { through: 'appliedRules' });
  rules.belongsTo(users);

  budgets.belongsTo(tags);
}