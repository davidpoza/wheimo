import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';


const route = Router();

export default (app) => {
  const loggerInstance = Container.get('loggerInstance');
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
      try {
        const authService = Container.get('authService');
        const user = await authService.signIn(req.body);
        return res.status(200).json(user);
      } catch (e) {
        loggerInstance.error('🔥 error: %o', e);
        return next(e);
      }
    });
};