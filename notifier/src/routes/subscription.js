import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import isAuthMiddleware from '../middlewares/isauth.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');
  const db = Container.get('lowdb');
  app.use('/subscription', route);

  route.post('/',
    isAuthMiddleware,
    async (req, res, next) => {
      const subscription = { ...req.body, userId: req.user };
      db.defaults({ subscriptions: [] })
        .write();

      const existingSubscription  = db
        .get('subscriptions')
        .find({ userId: req.user, endpoint: subscription.endpoint,  })
        .value();

      if (!existingSubscription) {
        db.get('subscriptions')
          .push(subscription)
          .write();
      }

      // @TODO: store subscription into lowdb database
      // @TODO solo puede haber un subscription por userId, si ya existe, se actualiza el objeto

      return res.sendStatus(200);
    });
};