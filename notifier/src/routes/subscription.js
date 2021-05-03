import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import isAuthMiddleware from '../middlewares/isauth.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/subscription', route);

  route.post('/',
    isAuthMiddleware,
    async (req, res, next) => {
      const subscription = req.body;
      // try {
      //   const user = await userService.create(
      //     { email, name, password, active, level }
      //   );
      //   res.status(201).json(user);
      // } catch (err) {
      //   loggerInstance.error('🔥 error: %o', err);
      //   if (err.name === 'SequelizeUniqueConstraintError') {
      //     return res.sendStatus(400);
      //   }
      //   return next(err);
      // }
    });
};