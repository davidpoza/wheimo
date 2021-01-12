import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/transactions', route);

  route.post('/',
 //   middlewares.isAuth,
    celebrate({
      body: Joi.object({
        emitter: Joi.string().required(),
        emitterName: Joi.string(),
        amount: Joi.number().required(),
        description: Joi.string(),
        accountId: Joi.number().required(),
      }),
    }),
    async (req, res, next) => {
      const transactionService = Container.get('transactionService');
      const { emitter, emitterName, amount, description, accountId } = req.body;
      try {
        const transaction = await transactionService.create(
          { emitter, emitterName, amount, description, accountId }
        );
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
   // middlewares.isAuth,
    celebrate({
      body: Joi.object({
        emitter: Joi.string(),
        emitterName: Joi.string(),
        amount: Joi.number(),
        description: Joi.string(),
        accountId: Joi.number(),
      }),
    }),
    async (req, res, next) => {
      const transactionService = Container.get('transactionService');
      const { id } = req.params;
      const { emitter, emitterName, amount, description, accountId } = req.body;
      try {
        const transaction = await transactionService.updateById(id,
          { emitter, emitterName, amount, description, accountId }
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
    //middlewares.isAuth,
    async (req, res, next) => {
    const { id } = req.params
    const transactionService = Container.get('transactionService');
    try {
      if (id) {
        const transaction = await transactionService.findById(id);
        if (!transaction) {
          return res.sendStatus(404);
        }
        return res.status(200).json(transaction);
      }
      const transactions = await transactionService.findAll();
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
    const transactionService = Container.get('transactionService');
    try {
      await transactionService.deleteById(id);
      return res.sendStatus(204);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return res.sendStatus(404);
    }
  });
};