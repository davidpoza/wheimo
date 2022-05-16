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
        bankId: Joi.string().required(),
        settings: Joi.object({
          contract: Joi.string(),
          product: Joi.string()
        }),
        accessId: Joi.string(),
        accessPassword: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      const accountService = Container.get('accountService');
      const {
        name, number, description, bankId, accessId, accessPassword, settings
      } = req.body;
      const userId = req.user.id;
      try {
        const account = await accountService.create(
          {
            name,
            number,
            description,
            userId,
            bankId,
            accessId,
            accessPassword,
            settings
          }
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
        savingTargetAmount: Joi.number(),
        savingInitialAmount: Joi.number(),
        savingFrequency: Joi.string(),
        savingAmountFunc: Joi.string(),
        savingTargetDate: Joi.string(),
        savingInitDate: Joi.string(),
        bankId: Joi.string(),
        settings: Joi.object({
          contract: Joi.string(),
          product: Joi.string(),
          nordigenLink: Joi.string(),
          nordigenRequisitionId: Joi.string(),
          nordigenAccountId: Joi.string(),
          nordigenRequisitionEndDate: Joi.string()

        }),
        accessId: Joi.string(),
        accessPassword: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      const accountService = Container.get('accountService');
      const { id } = req.params;
      const userId = req.user.id;
      const {
        accessId,
        accessPassword,
        balance,
        bankId,
        description,
        name,
        number,
        savingAmountFunc,
        savingFrequency,
        savingInitDate,
        savingInitialAmount,
        savingTargetAmount,
        savingTargetDate,
        settings,
      } = req.body;
      try {
        const account = await accountService.updateById(id, userId,
          {
            accessId,
            accessPassword,
            balance,
            bankId,
            description,
            name,
            number,
            savingAmountFunc,
            savingFrequency,
            savingInitDate,
            savingInitialAmount,
            savingTargetAmount,
            savingTargetDate,
            settings
          }
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

  route.post('/:id/resync',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        from: Joi.string().required(),
        contract: Joi.string(),
        product: Joi.string()
      }),
    }),
    async (req, res, next) => {
      const transactionService = Container.get('transactionService');
      const { from, contract, product } = req.body;
      const { id } = req.params;
      const userId = req.user.id;
      try {
        await transactionService.resync(
          { accountId:id, userId, from, settings: { contract, product } }
        );
        res.sendStatus(204);
      } catch (err) {
        loggerInstance.error(err.message);
        if (err.name === 'SequelizeUniqueConstraintError') {
          return res.sendStatus(400);
        } else if (err.name === 'not-found') {
          return res.sendStatus(404);
        } else if (err.name === 'forbidden') {
          return res.sendStatus(403);
        }
        return next(err);
      }
    });

    route.post('/fix-balances',
      middlewares.isAuth,
      celebrate({
        body: Joi.object({
          fromTransactionId: Joi.number().required(),
          initialBalance: Joi.number(),
          onlyRegenerateImportId: Joi.bool(),
          accountId: Joi.number().required()
        }),
      }),
      async (req, res, next) => {
        const transactionService = Container.get('transactionService');
        const accountService = Container.get('accountService');

        const { initialBalance, fromTransactionId, accountId, onlyRegenerateImportId } = req.body;
        const userId = req.user.id;

        try {
          let transactions = await transactionService.findAll({ userId, accountId, sort: 'desc' });
          await accountService.fixBalances({ transactions, initialBalance, fromTransactionId, userId, onlyRegenerateImportId });
          res.sendStatus(204);
        } catch (err) {
          loggerInstance.error(err.message);
          if (err.name === 'SequelizeUniqueConstraintError') {
            return res.sendStatus(400);
          } else if (err.name === 'not-found') {
            return res.sendStatus(404);
          } else if (err.name === 'forbidden') {
            return res.sendStatus(403);
          }
          return next(err);
        }
      });
};