// this file will define associations after all models have been defined.function applyExtraSetup(sequelize) {
export default function applyExtraSetup(sequelize) {
  const { users, accounts, transactions, tags, rules, recurrentPayments } = sequelize.models;

  accounts.hasMany(transactions);
  accounts.hasMany(recurrentPayments);
  accounts.belongsTo(users);

  recurrentPayments.belongsTo(transactions);
  recurrentPayments.belongsTo(accounts);

  tags.belongsToMany(transactions, { through: 'tagged' });
  tags.belongsToMany(rules, { through: 'appliedRules' });

  transactions.belongsTo(accounts);
  transactions.belongsToMany(tags, { through: 'tagged' });

  users.hasMany(accounts);
  users.hasMany(rules);

  rules.belongsToMany(tags, { through: 'appliedRules' });
  rules.belongsTo(users);
}