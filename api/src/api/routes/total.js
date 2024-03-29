import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/totals', route);

  route.get('/',
    middlewares.isAuth,
    async (req, res, next) => {
    const { from, to, 'group-by': groupBy, tags } = req.query;
    const tagsArray = tags ? tags.split(',').map((id) => parseInt(id, 10)) : undefined;
    const userId = req.user.id;
    const transactionService = Container.get('transactionService');
    try {
      const transactions = await transactionService.getTransactionsCalendar({ userId, from, to, groupBy, tags: tagsArray });
      return res.status(200).json(transactions);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });

  route.post('/calculate-statistics',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required()
      }),
    }),
    async (req, res, next) => {
    const { from, to } = req.body;
    const userId = req.user.id;
    const transactionService = Container.get('transactionService');
    try {
      const result = await transactionService.calculateStatistics({ userId, from, to });
      return res.status(200).json(result);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });
};