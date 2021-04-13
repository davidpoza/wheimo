import { Container } from 'typedi';
import pickBy from 'lodash.pickby';
import CryptoJS from 'crypto-js';

import config from '../config/config.js';

export default class AttachmentService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.sequelizeOp = this.sequelize.Sequelize.Op;
    this.dayjs = Container.get('dayjs');
    this.logger = Container.get('loggerInstance');
    this.attachmentModel = this.sequelize.models.attachments;
    this.transactionService = Container.get('transactionService');
    this.AES = Container.get('AES');
  }

  /**
   * @param {Object} attachment
   */
  getTemplate(attachment) {
    if (attachment) {
      return ({
        id: attachment.id,
        filename: attachment.filename,
        description: attachment.description,
      });
    }
    return null;
  }

  /**
    * It only creates attachment for owned transactions.
    * @param {Object} param
    * @param {string} param.transactionId
    * @param {string} param.filename
    * @param {string} param.description
    */
  async create({
    transactionId,
    userId,
    filename,
    description,
  }) {
    try {
      const transaction = await this.transactionService.findById({ id: transactionId, userId });
      if (transaction) {
        let attachment = await this.attachmentModel.create(
          {
            transactionId,
            filename,
            description,
          });
        return (this.getTemplate(attachment));
      }
      return null;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  /**
   * It only selects owned transactions->accounts
   * @param {Object} param
   * @param {number} param.transactionId - filter by account id
   * @param {number} param.userId - filter by user id
   * @param {number} param.limit - query limit
   * @param {number} param.offset - query offset
   * @param {string} param.from - includes transaction from date in format YYYY-MM-DD
   * @param {string} param.to - includes transaction to date in format YYYY-MM-DD
   * @param {string} param.sort - asc/desc sorting by date
   * @param {string} param.search - search term
   */
  async findAll({ attachmentId, userId, from, to, limit, offset, sort }) {
    const dateFilter = (from || to) ? {} : undefined;
    if (from) dateFilter[this.sequelizeOp.gte] = this.dayjs(from, 'YYYY-MM-DD').toDate();
    if (to) dateFilter[this.sequelizeOp.lte] = this.dayjs(to, 'YYYY-MM-DD').toDate();
    const searchFilter = search ? {} : undefined;

    let filter = pickBy({ // pickBy (by default) removes undefined keys
      attachmentId,
      '$tags.id$': tags,
      '$account.user_id$': userId,
      'date': dateFilter,
      'description': searchFilter,
    });

    const attachments = await this.attachmentModel.findAll(
      {
        limit,
        offset,
        where: filter,
        order: [ ['date', sort === 'asc' ? 'ASC' : 'DESC'] ]
      });

    return attachments.map((t) => {
      return this.getTemplate(t);
    });
  }

  /**
   * It only selects owned transactions->accounts
   */
  async findById({ id, userId, entity = false, admin = false }) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      '$transaction.account.user_id$': admin ? undefined : userId,
    });
    const attachment = await this.attachmentModel.findOne({
      where: filter,
      include: [
        { model: this.sequelize.models.transactions },
      ]
    });
    if (!attachment) {
      return null;
    }
    if (entity) {
      return attachment;
    }
    return this.getTemplate(attachment.dataValues);
  }


  /**
   * It only updates owned transactions->accounts
   */
  async updateById(id, userId, values) {
    let transaction = this.findById({ id, userId });
    if (transaction) {
      const affectedRows = await this.transactionModel.update(values, { where: { id } });
      if (affectedRows === 0) {
        return null;
      }
      transaction = await this.findById({ id, userId, entity: true });

      if (values.tags) {
        await transaction.setTags(values.tags);
        transaction = await this.findById({ id });
      }

      return this.getTemplate(transaction);
    }
    return null;
  }

  /**
   * It only deletes owned transactions->accounts
   */
  async deleteById(id, userId) {
     const attachment = await this.findById({ id, userId, entity: true });
    if (transaction) {
      const affectedRows = await transaction.destroy();
      if (affectedRows === 0) {
        throw new Error('Transaction does not exist');
      }
    }
    return null;
  }
};
