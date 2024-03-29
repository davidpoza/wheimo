import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/tags', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        rules: Joi.array().items(Joi.number()),
      }),
    }),
    async (req, res, next) => {
      const tagService = Container.get('tagService');
      const { name, rules } = req.body;
      const userId = req.user.id;
      try {
        const transaction = await tagService.create({ name, rules, userId });
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
        name: Joi.string(),
        rules: Joi.array().items(Joi.number()),
      }),
    }),
    async (req, res, next) => {
      const tagService = Container.get('tagService');
      const { id } = req.params;
      const { name, rules } = req.body;
      const userId = req.user.id;
      try {
        const tag = await tagService.updateById(id, userId, { name, rules });
        if (!tag) {
          res.sendStatus(404);
        }
        res.status(200).json(tag);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  route.get('/:id?',
    middlewares.isAuth,
    async (req, res, next) => {
    const { id } = req.params;
    const { limit, sort, offset, orderBy } = req.query;
    const userId = req.user.id;
    const tagService = Container.get('tagService');
    try {
      if (id) {
        const tag = await tagService.findById({ id, userId });
        if (!tag) {
          return res.sendStatus(404);
        }
        return res.status(200).json(tag);
      }
      const tags = await tagService.findAll({ userId, limit, offset, sort, orderBy });
      return res.status(200).json(tags);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });

  route.delete('/:id',
    middlewares.isAuth,
    async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const tagService = Container.get('tagService');
    try {
      await tagService.deleteById(id, userId);
      return res.sendStatus(204);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return res.sendStatus(404);
    }
  });

  // applies a tag across all of user transactions
  route.post('/:id/apply',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const userId = req.user.id;
      const transactionService = Container.get('transactionService');
      const tagService = Container.get('tagService');
      try {
        const transactions = await transactionService.findAll({ userId });
        if (!transactions) {
          return res.sendStatus(404);
        }
        const tag = await tagService.findById({ id, userId });
        const transactionTagged = await transactionService.applyTags(transactions, tag.rules);
        return res.status(200).json(transactionTagged);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

    // removes tag from all user transactions
  route.post('/:id/untag',
  middlewares.isAuth,
  async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id;
    const transactionService = Container.get('transactionService');
    try {
      const transactions = await transactionService.findAll({ userId });
      if (!transactions) {
        return res.sendStatus(404);
      }
      await transactionService.untagTransactions(transactions, parseInt(id, 10));
      return res.sendStatus(204);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });
};