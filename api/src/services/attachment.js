import { Container } from 'typedi';
import pickBy from 'lodash.pickby';
import CryptoJS from 'crypto-js';
import fs from 'fs';
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
        type: attachment.type,
        createdAt: attachment.createdAt,
      });
    }
    return null;
  }

  /**
    * It only creates attachment for owned attachment: attachment->transaction->account->userId.
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
    type
  }) {
    try {
      const transaction = await this.transactionService.findById({ id: transactionId, userId });
      if (transaction) {
        let attachment = await this.attachmentModel.create(
          {
            transactionId,
            filename,
            description,
            type
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
   * It only selects owned: attachment->transaction->account->userId
   * @param {Object} param
   * @param {number} param.transactionId - filter by account id
   * @param {number} param.userId - filter by user id
   * @param {number} param.limit - query limit
   * @param {number} param.offset - query offset
   * @param {string} param.sort - asc/desc sorting by date
   * @param {string} param.search - search term
   */
  async findAll({ admin = false, attachmentId, userId, limit, offset, sort, search }) {
    const searchFilter = search ? {} : undefined;

    let filter = pickBy({ // pickBy (by default) removes undefined keys
      attachmentId,
      '$transaction.account.user_id$': admin ? undefined : userId,
      'description': searchFilter,
    });

    const attachments = await this.attachmentModel.findAll(
      {
        include: [
          {
            model: this.sequelize.models.transactions,
            include: {
              model: this.sequelize.models.accounts,
            }
          },
        ],
        limit,
        offset,
        where: filter,
        order: [ ['updated_at', sort === 'asc' ? 'ASC' : 'DESC'] ]
      });

    return attachments.map((t) => {
      return this.getTemplate(t);
    });
  }

  /**
   * It only selects owned: attachment->transaction->account->userId
   */
  async findById({ id, userId, entity = false, admin = false }) {
    const filter = pickBy({ // pickBy (by default) removes undefined keys
      id,
      '$transaction.account.user_id$': admin ? undefined : userId,
    });
    const attachment = await this.attachmentModel.findOne({
      where: filter,
      include: [
        {
          model: this.sequelize.models.transactions,
          include: {
            model: this.sequelize.models.accounts,
          }
        },
      ],
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
   * It only updates owned: attachment->transaction->account->userId
   */
  async updateById(id, userId, values) {
    let attachment = this.findById({ id, userId });
    if (attachment) {
      const affectedRows = await this.attachmentModel.update(values, { where: { id } });
      if (affectedRows === 0) {
        return null;
      }
      attachment = await this.findById({ id, userId, entity: true });

      return this.getTemplate(attachment);
    }
    return null;
  }

  /**
   * It only deletes owned attachment
   */
  async deleteById(id, userId) {
    const attachment = await this.findById({ id, userId, entity: true });
    if (attachment) {
      const affectedRows = await attachment.destroy();
      if (affectedRows === 0) {
        throw new Error('Attachment does not exist');
      }
      try {
        fs.unlinkSync(`${config.uploadDir}/${attachment.filename}`);
      } catch (error) {
        throw new Error('Error during attachment deletion from disk.');
      }
      return attachment;
    }
    return null;
  }

  /**
   * @param {Object} file - multer middleware object
   * @returns {boolean}
   */
  validateUpload(file) {
    if (!file || file.fieldname !== 'attachment') throw new Error('Attachment field is required');
    if (!['image/jpeg', 'application/pdf'].includes(file.mimetype)) throw new Error('Attachment is not jpg or pdf');
    if ((file.size / 1024 / 1024) > config.uploadMaxSize) throw new Error('Attachment file size is too big');
    return true;
  }
};
