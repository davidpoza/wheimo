import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/recurrents', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().required(),
        emitter: Joi.string().required(),
        transactionId: Joi.number().allow(null),
      }),
    }),
    async (req, res, next) => {
      const recurrentService = Container.get('recurrentService');
      const { name, amount, emitter, transactionId } = req.body;
      try {
        const recurrent = await recurrentService.create(
          { name, amount, emitter, transactionId }
        );
        res.status(201).json(recurrent);
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
        amount: Joi.number(),
        emitter: Joi.string(),
        transactionId: Joi.number().allow(null),
      }),
    }),
    async (req, res, next) => {
      const recurrentService = Container.get('recurrentService');
      const { id } = req.params;
      const { name, amount, emitter, transactionId } = req.body;
      const userId = req.user.id;
      try {
        const recurrent = await recurrentService.updateById(id,
          { name, amount, emitter, transactionId }
        );
        if (!recurrent) {
          res.sendStatus(404);
        }
        res.status(200).json(recurrent);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  route.get('/:id?',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const { transactionId, limit, sort, offset } = req.query;
      const userId = req.user.id;
      const recurrentService = Container.get('recurrentService');
      try {
        if (id) {
          const recurrent = await recurrentService.findById(id, userId);
          if (!recurrent) {
            return res.sendStatus(404);
          }
          return res.status(200).json(recurrent);
        }
        const recurrents = await recurrentService.findAll(transactionId, userId, limit, offset, sort );
        return res.status(200).json(recurrents);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
  });

  route.delete('/:id',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params
      const recurrentService = Container.get('recurrentService');
      try {
        await recurrentService.deleteById(id);
        return res.sendStatus(204);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return res.sendStatus(404);
      }
  });
};