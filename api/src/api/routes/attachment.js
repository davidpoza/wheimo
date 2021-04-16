import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/attachments', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        filename: Joi.string().required(),
        transactionId: Joi.number().required(),
        description: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      const attachmentService = Container.get('attachmentService');
      const {
        filename,
        description,
        transactionId,
       } = req.body;
      const userId = req.user.id;
      try {
        const attachment = await attachmentService.create(
          {
            filename,
            description,
            transactionId
          }
        );
        if (!attachment) {
          res.sendStatus(403);
        }
        res.status(201).json(attachment);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          return res.sendStatus(400);
        }
        return next(err);
      }
    });

  route.patch('/:id',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        description: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      const transactionService = Container.get('transactionService');
      const { id } = req.params;
      const userId = req.user.id;
      const {
        accountId,
        amount,
        assCard,
        balance,
        comments,
        date,
        description,
        emitterName,
        favourite,
        receiverName,
        tags,
        valueDate,
      } = req.body;
      try {
        const transaction = await transactionService.updateById(id, userId,
          {
            accountId,
            amount,
            assCard,
            balance,
            comments,
            date,
            description,
            emitterName,
            favourite,
            receiverName,
            tags,
            valueDate,
          }
        );
        if (!transaction) {
          res.sendStatus(404);
        }
        res.status(200).json(transaction);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  route.get('/:id?',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const userId = req.user.id;
      const { limit, sort, offset, from, to, search } = req.query;
      const attachmentService = Container.get('attachmentService');
      try {
        if (id) {
          const attachment = await attachmentService.findById({ id, userId });
          if (!attachment) {
            return res.sendStatus(404);
          }
          return res.status(200).json(attachment);
        }
        const attachments = await attachmentService.findAll({ userId, from, to, limit, offset, sort, search });
        return res.status(200).json(attachments);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
  });

  route.delete('/:id',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const userId = req.user.id;
      const attachmentService = Container.get('attachmentService');
      try {
        if (!await attachmentService.deleteById(id, userId)) {
          return res.sendStatus(404);
        }
        return res.sendStatus(204);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        console.log('ERRRR', err);
        return res.sendStatus(404);
      }
  });
};