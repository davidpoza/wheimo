import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/transactions', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        receipt: Joi.boolean(),
        emitterName: Joi.string().allow(null, ''),
        receiverName: Joi.string().allow(null, ''),
        amount: Joi.number().required(),
        currency: Joi.string().required(),
        date: Joi.string().required(),
        valueDate: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        comments: Joi.string().allow(null, ''),
        assCard: Joi.string(),
        accountId: Joi.number().required(),
        tags: Joi.array().items(Joi.number()),
      }),
    }),
    async (req, res, next) => {
      const transactionService = Container.get('transactionService');
      const {
        receipt,
        emitterName,
        receiverName,
        amount,
        currency,
        description,
        comments,
        assCard,
        accountId,
        date,
        valueDate,
        tags
       } = req.body;
      const userId = req.user.id;
      try {
        const transaction = await transactionService.create(
          {
            receipt,
            emitterName,
            receiverName,
            amount,
            currency,
            description,
            comments,
            assCard,
            accountId,
            date,
            valueDate,
            tags,
            userId
          }
        );
        if (!transaction) {
          res.sendStatus(403);
        }
        res.status(201).json(transaction);
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
        receipt: Joi.boolean(),
        emitterName: Joi.string(),
        receiverName: Joi.string(),
        amount: Joi.number(),
        currency: Joi.string(),
        date: Joi.string(),
        valueDate: Joi.string(),
        description: Joi.string(),
        comments: Joi.string(),
        assCard: Joi.string(),
        accountId: Joi.number(),
        tags: Joi.array().items(Joi.number()),
      }),
    }),
    async (req, res, next) => {
      const transactionService = Container.get('transactionService');
      const { id } = req.params;
      const userId = req.user.id;
      const { emitterName, receiverName, amount, description, comments, assCard, accountId, tags } = req.body;
      try {
        const transaction = await transactionService.updateById(id, userId,
          { emitterName, receiverName, amount, description, assCard, accountId, tags }
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
      const { accountId, tags, limit, sort, offset, from, to } = req.query;
      const tagsArray = tags ? tags.split(',').map((id) => parseInt(id, 10)) : undefined;
      const transactionService = Container.get('transactionService');
      try {
        if (id) {
          const transaction = await transactionService.findById({ id, userId });
          if (!transaction) {
            return res.sendStatus(404);
          }
          return res.status(200).json(transaction);
        }
        const transactions = await transactionService.findAll({ accountId, userId, tags: tagsArray, from, to, limit, offset, sort });
        return res.status(200).json(transactions);
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
      const transactionService = Container.get('transactionService');
      try {
        await transactionService.deleteById(id, userId);
        return res.sendStatus(204);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        console.log('ERRRR', err);
        return res.sendStatus(404);
      }
  });
};