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
        accountId: Joi.number().required(),
        amount: Joi.number().required(),
        assCard: Joi.string(),
        balance: Joi.number(),
        comments: Joi.string().allow(null, ''),
        currency: Joi.string().required(),
        date: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        emitterName: Joi.string().allow(null, ''),
        receipt: Joi.boolean(),
        draft: Joi.boolean(),
        receiverName: Joi.string().allow(null, ''),
        tags: Joi.array().items(Joi.number()),
        valueDate: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const transactionService = Container.get('transactionService');
      const {
        accountId,
        amount,
        assCard,
        balance,
        comments,
        currency,
        date,
        description,
        emitterName,
        receipt,
        draft,
        receiverName,
        tags,
        valueDate,
       } = req.body;
      const userId = req.user.id;
      try {
        const transaction = await transactionService.create(
          {
            accountId,
            amount,
            assCard,
            balance,
            comments,
            currency,
            date,
            description,
            emitterName,
            receipt,
            draft,
            receiverName,
            tags,
            userId,
            valueDate,
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
        accountId: Joi.number(),
        amount: Joi.number(),
        assCard: Joi.string(),
        balance: Joi.number(),
        comments: Joi.string().allow(''),
        currency: Joi.string(),
        date: Joi.string(),
        description: Joi.string().allow(null, ''),
        emitterName: Joi.string(),
        favourite: Joi.boolean(),
        receipt: Joi.boolean(),
        draft: Joi.boolean(),
        receiverName: Joi.string(),
        tags: Joi.array().items(Joi.number()),
        valueDate: Joi.string(),
        attachments: Joi.array().items(Joi.number()),
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
        attachments,
        balance,
        comments,
        date,
        description,
        draft,
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
            attachments,
            balance,
            comments,
            date,
            description,
            draft,
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

  // get totals for each tag of given transactions
  route.get('/tags',
  middlewares.isAuth,
  async (req, res, next) => {
    const userId = req.user.id;
    const { accountId, from, to } = req.query;
    const transactionService = Container.get('transactionService');
    try {
      const transactions = await transactionService.calculateExpensesByTags({ accountId, userId, from, to });
      return res.status(200).json(transactions);
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
      const { accountId, tags, limit, sort, offset, from, to, search, min, max, operationType, isFav, isDraft, hasAttachments, ids } = req.query;
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
        const transactions = await transactionService.findAll({
          accountId, userId, tags: tagsArray, from, to, min, max, limit, offset, sort, search, operationType, isDraft, isFav, hasAttachments, ids
        });
        return res.status(200).json(transactions);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
  });

  route.delete('/:id?',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const { ids } = req.query;
      const userId = req.user.id;
      const transactionService = Container.get('transactionService');
      try {
        if (ids) {
          if (!await transactionService.deleteByIdList(ids, userId)) {
            return res.sendStatus(404);
          }
        } else if (!await transactionService.deleteById(id, userId)) {
          return res.sendStatus(404);
        }
        return res.sendStatus(204);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        console.log('ERRRR', err);
        return res.sendStatus(404);
      }
  });

  route.post('/:id/apply-tags',
  middlewares.isAuth,
  async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id;
    const transactionService = Container.get('transactionService');
    const ruleService = Container.get('ruleService');
    try {
      const transaction = await transactionService.findById({ id, userId });
      if (!transaction) {
        return res.sendStatus(404);
      }
      const userRules = await ruleService.findAll(userId);
      await transactionService.applyTags([transaction], userRules);
      return res.sendStatus(200);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });

  // apply specific tag
  route.post('/apply-specific-tags',
  middlewares.isAuth,
  celebrate({
    body: Joi.object({
      ids: Joi.array().items(Joi.number()).required(),
      tagIds: Joi.array().items(Joi.number()).required(),
    }),
  }),
  async (req, res, next) => {
    const { ids, tagIds } = req.body;
    const userId = req.user.id;
    const transactionService = Container.get('transactionService');
    try {
      const tags = await transactionService.tagTransactions(ids, tagIds, userId);
      return res.status(200).json(tags);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });
};