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

      // @TODO: store subscription into lowdb database

      return res.status(200);
    });
};