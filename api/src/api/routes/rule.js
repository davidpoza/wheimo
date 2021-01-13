import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/rules', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        value: Joi.string().required()
      }),
    }),
    async (req, res, next) => {
      const ruleService = Container.get('ruleService');
      const { name, type, value } = req.body;
      try {
        const rule = await ruleService.create({ name, type, value, userId: req.user.id });
        res.status(201).json(rule);
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
        type: Joi.string(),
        value: Joi.string()
      }),
    }),
    async (req, res, next) => {
      const ruleService = Container.get('ruleService');
      const { id } = req.params;
      const { name, type, value } = req.body;
      try {
        const rule = await ruleService.updateById(id, req.user.id, { name, type, value });
        if (!rule) {
          res.sendStatus(404);
        }
        res.status(200).json(rule);
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
    const ruleService = Container.get('ruleService');
    try {
      if (id) {
        const rule = await ruleService.findById(id, req.user.id);
        if (!rule) {
          return res.sendStatus(404);
        }
        return res.status(200).json(rule);
      }
      const rules = await ruleService.findAll(req.user.id, limit, offset, sort );
      return res.status(200).json(rules);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });

  route.delete('/:id',
    middlewares.isAuth,
    async (req, res, next) => {
    const { id } = req.params;
    const ruleService = Container.get('ruleService');
    try {
      await ruleService.deleteById(id);
      return res.sendStatus(204);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return res.sendStatus(404);
    }
  });
};