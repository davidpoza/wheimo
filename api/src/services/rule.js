import { Container } from 'typedi';
import pickBy from 'lodash.pickby';

export default class RuleService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.ruleModel = this.sequelize.models.rules;
    // console.log(this.evalRule({
    //   emitterName: 'Pedro',
    //   amount: 30,
    //   receipt: false
    // },
    // {
    //   type: 'receipt',
    //   value: false
    // })
    // );
  }

  getTemplate(rule) {
    if (rule) {
      return ({
        id: rule.id,
        name: rule.name,
        type: rule.type,
        value: rule.value,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      });
    }
  }

  async create({
    name, type, value, userId
  }) {
    try {
      const rule = await this.ruleModel.create({ name, type, value, userId });
      return rule;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findAll(userId, limit, offset, sort) {
    const rules = await this.ruleModel.findAll(
      {
        where: { userId },
        limit,
        offset,
        order: [ ['createdAt', sort === 'asc' ? 'ASC' : 'DESC'] ]
      }
    );

    return rules.map((t) => {
      return (this.getTemplate(t));
    });
  }

  async findById(id, userId) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId,
    });
    const rule = await this.ruleModel.findOne({ where: filter });
    if (!rule) {
      return null;
    }
    return (this.getTemplate(rule.dataValues));
  }

  async updateById(id, userId, values) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      userId,
    });
    const affectedRows = await this.ruleModel.update(values, { where: filter });
    if (affectedRows === 0) {
      return null;
    }
    return this.findById(id, userId);
  }

  async deleteById(id) {
    const affectedRows = await this.ruleModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      throw new Error('Rule does not exist');
    }
  }

  /**
   * Checks if rule matches with transaction
   * @param {Object} transaction
   * @param {string} transaction.emitterName
   * @param {string} transaction.receiverName
   * @param {string} transaction.description
   * @param {string} transaction.currency
   * @param {string} transaction.card
   * @param {string} transaction.bankId
   * @param {string} transaction.account - this is the account.number field
   * @param {boolean} transaction.receipt
   * @param {number} transaction.amount
   * @param {Object} rule
   * @param {string} rule.type
   * @param {string} rule.value - expression with valid format. prepare doc
   */
  evalRule(transaction, rule) {
    switch(rule.type) {
      case 'emitterName':
        return transaction.emitterName.match(new RegExp(rule.value, 'i'));
      case 'receiverName':
        return transaction.receiverName.match(new RegExp(rule.value, 'i'));
      case 'description':
        return transaction.description.match(new RegExp(rule.value, 'i'));
      case 'currency':
        return transaction.currency === rule.value;
      case 'account':
        return transaction.account === rule.value;
      case 'bankId':
        return transaction.bankId === rule.value;
      case 'amount': // e.g. lt20;gt10
        const comparisons = rule.value.split(';');
        return comparisons.map((comp) => {
          const matches = comp.match(/(gt|gte|lt|lte|eq)(\d*)/);
          const op = matches[1];
          const amount = parseFloat(matches[2]);
          if (op === 'lt') {
            return transaction.amount < amount;
          } else if (op === 'gt') {
            return transaction.amount > amount;
          } else if (op === 'lte') {
            return transaction.amount <= amount;
          } else if (op === 'gte') {
            return transaction.amount >= amount;
          } else if (op === 'eq') {
            return transaction.amount === amount;
          }
        }).every((c) => c);
      case 'card':
        return transaction.addCard.match(new RegExp(rule.value, 'i'));
      case 'receipt': // true, false
        return rule.value ? transaction.receipt : !transaction.receipt;
    }
  }
};