import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
const envFound = dotenv.config();

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
import { definition as budgetDefinition } from '../src/models/budget.js';
import { definition as attachmentDefinition } from '../src/models/attachment.js';

const sequelize = sequelizeLoader.newConnection();
const queryInterface = sequelize.getQueryInterface();

queryInterface.dropTable('users');
queryInterface.dropTable('accounts');
queryInterface.dropTable('transactions');
queryInterface.dropTable('tags');
queryInterface.dropTable('recurrents');
queryInterface.dropTable('rules');
queryInterface.dropTable('tagged');
queryInterface.dropTable('appliedRules');
queryInterface.dropTable('budgets');
queryInterface.dropTable('attachments');

queryInterface.createTable(...userDefinition);
queryInterface.createTable(...accountDefinition);
queryInterface.createTable(...transactionDefinition);
queryInterface.createTable(...tagDefinition);
queryInterface.createTable(...recurrentPaymentDefinition);
queryInterface.createTable(...ruleDefinition);
queryInterface.createTable(...taggedDefinition);
queryInterface.createTable(...appliedRulesDefinition);
queryInterface.createTable(...budgetDefinition);
queryInterface.createTable(...attachmentDefinition);

sequelize.models.users.create({
  email: process.env.ADMIN_EMAIL, name: 'admin', password: bcrypt.hashSync(process.env.ADMIN_PASS, config.bcryptRounds, config.bcryptSalt), active: true, level: 'admin'
});

sequelize.models.accounts.create({
  name: 'openbank nómina', description: 'cuenta principal', number: 'ES27 0073 0100 5504 7468 0000', bankId: 'opbk', userId: 1
});

sequelize.models.accounts.create({
  name: 'openbank compras', description: 'compras en internet', number: 'ES27 0073 0100 5504 7468 0011', bankId: 'opbk',  userId: 1
});

sequelize.models.tags.create({
  name: 'pagos de pepe de más de 5 euros', userId: 1
});

sequelize.models.rules.create({
  name: 'regla pagos de pepe', type: 'emitterName', value: 'Pepe', userId: 1
});

sequelize.models.rules.create({
  name: 'regla transacciones de más de 5 euros', type: 'amount', value: 'gt5', userId: 1
});

sequelize.models.appliedRules.create({
  ruleId: 1, tagId: 1
});

sequelize.models.appliedRules.create({
  ruleId: 2, tagId: 1
});

// ---------------


sequelize.models.tags.create({
  name: 'pagos de más de 50€', userId: 1
});

sequelize.models.rules.create({
  name: 'regla de gastos', type: 'isExpense', value: 'true', userId: 1
});

sequelize.models.rules.create({
  name: 'regla de cantidad mayor que 50', type: 'amount', value: 'gt50', userId: 1
});

sequelize.models.appliedRules.create({
  ruleId: 3, tagId: 2
});

sequelize.models.appliedRules.create({
  ruleId: 4, tagId: 2
});