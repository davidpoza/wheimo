// this file will define associations after all models have been defined.function applyExtraSetup(sequelize) {
export default function applyExtraSetup(sequelize) {
  const { accounts, transactions, tags, rules, recurrentPayments } = sequelize.models;

  accounts.hasMany(transactions);
  accounts.hasMany(recurrentPayments);

  recurrentPayments.belongsTo(transactions);
  recurrentPayments.belongsTo(accounts);

  tags.belongsToMany(transactions, { through: 'tags_transactions' });
  tags.belongsToMany(rules, { through: 'rules_tags' });

  transactions.belongsTo(accounts);
  transactions.belongsToMany(tags, { through: 'tags_transactions' });

  rules.belongsToMany(tags, { through: 'rules_tags' });
}