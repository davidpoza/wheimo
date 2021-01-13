import bcrypt from 'bcrypt';

import config from '../src/config/config.js'
import sequelizeLoader from '../src/loaders/sequelize.js';
import { definition as userDefinition } from '../src/models/user.js';
import { definition as accountDefinition } from '../src/models/account.js';
import { definition as transactionDefinition } from '../src/models/transaction.js';
import { definition as tagDefinition } from '../src/models/tag.js';
import { definition as recurrentPaymentDefinition } from '../src/models/recurrent-payment.js';
import { definition as ruleDefinition } from '../src/models/rule.js';
import { definition as taggedDefinition } from '../src/models/tagged.js';
import { definition as appliedRulesDefinition } from '../src/models/applied-rules.js';

const sequelize = sequelizeLoader.newConnection();
const queryInterface = sequelize.getQueryInterface();

queryInterface.dropTable('users');
queryInterface.dropTable('accounts');
queryInterface.dropTable('transactions');
queryInterface.dropTable('tags');
queryInterface.dropTable('recurrentPayments');
queryInterface.dropTable('rules');
queryInterface.dropTable('tagged');
queryInterface.dropTable('appliedRules');

queryInterface.createTable(...userDefinition);
queryInterface.createTable(...accountDefinition);
queryInterface.createTable(...transactionDefinition);
queryInterface.createTable(...tagDefinition);
queryInterface.createTable(...recurrentPaymentDefinition);
queryInterface.createTable(...ruleDefinition);
queryInterface.createTable(...taggedDefinition);
queryInterface.createTable(...appliedRulesDefinition);

sequelize.models.users.create({
  email: 'admin@gmail.com', name: 'admin', password: bcrypt.hashSync('admin', config.bcryptRounds, config.bcryptSalt), active: true, level: 'admin'
});

sequelize.models.accounts.create({
  name: 'openbank nómina', description: 'cuenta principal', number: 'ES27 0073 0100 5504 7468 0000', userId: 1
});

sequelize.models.accounts.create({
  name: 'openbank compras', description: 'compras en internet', number: 'ES27 0073 0100 5504 7468 0011', userId: 1
})