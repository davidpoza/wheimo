import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/budgets', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        value: Joi.number().required(),
        start: Joi.string().required().regex(/\d{4}-\d{2}-\d{2}/),
        end: Joi.string().required().regex(/\d{4}-\d{2}-\d{2}/),
        tagId: Joi.number().required(),
      }),
    }),
    async (req, res, next) => {
      const budgetService = Container.get('budgetService');
      const { value, start, end, tagId } = req.body;
      const userId = req.user.id;
      try {
        const budget = await budgetService.create({ value, start, end, tagId, userId });
        res.status(201).json(budget);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        if (err.name === 'notfound') {
          return res.sendStatus(404);
        } else if (err.name === 'SequelizeUniqueConstraintError') {
          return res.sendStatus(400);
        }
        return next(err);
      }
    });

  route.patch('/:id',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        value: Joi.number(),
        start: Joi.string().regex(/\d{4}-\d{2}-\d{2}/),
        end: Joi.string().regex(/\d{4}-\d{2}-\d{2}/),
      }),
    }),
    async (req, res, next) => {
      const budgetService = Container.get('budgetService');
      const { id } = req.params;
      const { value, start, end, tagId } = req.body;
      const userId = req.user.id;
      try {
        const budget = await budgetService.updateById(id, userId, { value, start, end, tagId });
        if (!budget) {
          res.sendStatus(404);
        }
        res.status(200).json(budget);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  route.get('/:id?',
    middlewares.isAuth,
    async (req, res, next) => {
    const { id } = req.params;
    const { limit, sort, offset } = req.query;
    const userId = req.user.id;
    const budgetService = Container.get('budgetService');
    try {
      if (id) {
        const tag = await budgetService.findById({ id, userId });
        if (!tag) {
          return res.sendStatus(404);
        }
        return res.status(200).json(tag);
      }
      const tags = await budgetService.findAll({ userId, limit, offset, sort });
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
    const budgetService = Container.get('budgetService');
    try {
      await budgetService.deleteById(id, userId);
      return res.sendStatus(204);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return res.sendStatus(404);
    }
  });
};