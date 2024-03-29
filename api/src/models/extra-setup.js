// this file will define associations after all models have been defined.function applyExtraSetup(sequelize) {
export default function applyExtraSetup(sequelize) {
  const { users, accounts, transactions, tags, rules, recurrents, budgets, attachments, logs } = sequelize.models;

  logs.belongsTo(users);

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
  transactions.belongsToMany(tags, { through: 'tagged'  });
  transactions.hasMany(attachments);

  users.hasMany(accounts);
  users.hasMany(rules);
  users.hasMany(tags);
  users.hasMany(logs);

  rules.belongsToMany(tags, { through: 'appliedRules' });
  rules.belongsTo(users);

  budgets.belongsTo(tags);

  attachments.belongsTo(transactions);
}