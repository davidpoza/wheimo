import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/nordigen', route);

  route.post('/create-link',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        accountId: Joi.number().required(),
        institutionId: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const accountService = Container.get('accountService');
      const nordigenService = Container.get('nordigenService');

      const {
        accountId, institutionId
      } = req.body;
      const userId = req.user.id;
      try {
        const account = await accountService.findById(accountId, userId, true);
        const data = await nordigenService.getLink(account.accessId, account.accessPassword, institutionId);
        res.status(201).json(data);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          return res.sendStatus(400);
        }
        return next(err);
      }
    });

    route.post('/retrieve-account-list',
      middlewares.isAuth,
      celebrate({
        body: Joi.object({
          accountId: Joi.number().required(),
          requisitionId: Joi.string().required(),
          token: Joi.string().required(),
        }),
      }),
      async (req, res, next) => {
        const accountService = Container.get('accountService');
        const nordigenService = Container.get('nordigenService');

        const {
          accountId, requisitionId, token
        } = req.body;
        const userId = req.user.id;
        try {
          const account = await accountService.findById(accountId, userId, true);
          const data = await nordigenService.getAccounts(account.accessId, account.accessPassword, token, requisitionId);
          res.status(201).json(data);
        } catch (err) {
          loggerInstance.error('🔥 error: %o', err);
          if (err.name === 'SequelizeUniqueConstraintError') {
            return res.sendStatus(400);
          }
          return next(err);
        }
      });


    route.post('/retrieve-transactions',
      middlewares.isAuth,
      celebrate({
        body: Joi.object({
          nordigenAccountId: Joi.string().required(),
          accountId: Joi.number().required(),
          token: Joi.string().required(),
        }),
      }),
      async (req, res, next) => {
        const accountService = Container.get('accountService');
        const nordigenService = Container.get('nordigenService');

        const {
          accountId, nordigenAccountId, token
        } = req.body;
        const userId = req.user.id;
        try {
          const account = await accountService.findById(accountId, userId, true);
          const data = await nordigenService.getTransactions(account.accessId, account.accessPassword, token, nordigenAccountId);
          res.status(200).json(data);
        } catch (err) {
          loggerInstance.error('🔥 error: %o', err);
          if (err.name === 'SequelizeUniqueConstraintError') {
            return res.sendStatus(400);
          }
          return next(err);
        }
      });

};