import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/users', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        active: Joi.bool(),
        level: Joi.string()
      }),
    }),
    async (req, res, next) => {
      const userService = Container.get('userService');
      const { email, name, password, active, level } = req.body;
      try {
        const user = await userService.create(
          { email, name, password, active, level }
        );
        res.status(201).json(user);
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
        email: Joi.string().email(),
        active: Joi.bool(),
        level: Joi.string(),
        theme: Joi.string(),
        lang: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      const userService = Container.get('userService');
      const { id } = req.params;
      const { email, name, active, level, theme, lang } = req.body;
      try {
        const user = await userService.updateById(id,
          { email, name, active, level, theme, lang }
        );
        if (!user) {
          res.sendStatus(404);
        }
        res.status(200).json(user);
      } catch (err) {
        loggerInstance.error('🔥 error: %o', err);
        return next(err);
      }
    });

  route.get('/:id?',
    middlewares.isAuth,
    async (req, res, next) => {
    const { id } = req.params;
    const userService = Container.get('userService');
    try {
      if (id) {
        const user = await userService.findById(id);
        if (!user) {
          return res.sendStatus(404);
        }
        return res.status(200).json(user);
      }
      const users = await userService.findAll();
      return res.status(200).json(users);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  });

  route.delete('/:id',
    middlewares.isAuth,
    async (req, res, next) => {
    const { id } = req.params
    const userService = Container.get('userService');
    try {
      await userService.deleteById(id);
      return res.sendStatus(204);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return res.sendStatus(404);
    }
  });
};