import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/accounts', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        number: Joi.string().required(),
        description: Joi.string(),
        bankId: Joi.number().allow(null),
      }),
    }),
    async (req, res, next) => {
      const accountService = Container.get('accountService');
      const { name, number, description, bankId, accessId, accessPassword } = req.body;
      const userId = req.user.id;
      try {
        const account = await accountService.create(
          { name, number, description, userId, bankId, accessId, accessPassword }
        );
        res.status(201).json(account);
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
        number: Joi.string(),
        description: Joi.string(),
        balance: Joi.number(),
        bankId: Joi.number().allow(null),
      }),
    }),
    async (req, res, next) => {
      const accountService = Container.get('accountService');
      const { id } = req.params;
      const userId = req.user.id;
      const { name, number, description, balance, bankId, accessId, accessPassword } = req.body;
      try {
        const account = await accountService.updateById(id, userId,
          { name, number, description, balance, bankId, accessId, accessPassword }
        );
        if (!account) {
          res.sendStatus(404);
        }
        res.status(200).json(account);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  route.get('/:id?',
    middlewares.isAuth,
    async (req, res, next) => {
      const { id } = req.params;
      const userId = req.user.id;
      const accountService = Container.get('accountService');
      try {
        if (id) {
          const account = await accountService.findById(id, userId);
          if (!account) {
            return res.sendStatus(404);
          }
          return res.status(200).json(account);
        }
        const accounts = await accountService.findAll(userId);
        return res.status(200).json(accounts);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    }
  );

  route.delete('/:id',
    middlewares.isAuth,
    async (req, res, next) => {
      const accountService = Container.get('accountService');
      const { id } = req.params;
      const userId = req.user.id;
      try {
        await accountService.deleteById(id, userId);
        return res.sendStatus(204);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return res.sendStatus(404);
      }
    }
  );
};