import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');

  app.use('/logs', route);

  route.get('/',
  middlewares.isAuth,
  async (req, res, next) => {
    const userId = req.user.id;
    const logService = Container.get('logService');
    try {
      const logs = await logService.findAll(userId);
      return res.status(200).json(logs);
    } catch (err) {
      loggerInstance.error('🔥 error: %o', err);
      return next(err);
    }
  })
};