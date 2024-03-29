import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');
  const logService = Container.get('logService');

  app.use('/auth', route);
  route.post('/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        const authService = Container.get('authService');
        const user = await authService.signUp(req.body);
        return res.status(201).json(user);
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return res.sendStatus(400);
        }
        loggerInstance.error('🔥 error: %o', e);
        return next(e);
      }
    });

  route.post('/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress)
        ?.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)
        ?.[0];
      try {
        const authService = Container.get('authService');
        const user = await authService.signIn(req.body);
        logService.create({ userId: user.id, ip });
        return res.status(200).json(user);
      } catch (e) {
        console.log(e)
        loggerInstance.error(`🔥 failed login attempt ::: ${ip}`);
        res.sendStatus(404);
      }
    });

  route.get('/validate',
    middlewares.isAuth,
    async (req, res, next) => {
      const userId = req.user.id;
      res.status(200).json({ userId });
    });
};