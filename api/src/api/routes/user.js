import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  app.use('/users', route);

  route.post('/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string(),
        email: Joi.string().required(),
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
        console.log(user)
        res.status(201).json(user);
      } catch (err) {
        return next(err);
      }
    });

  route.get('/:id?', middlewares.isAuth, async (req, res, next) => {
    const { id } = req.params
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
      return next(err);
    }
  });

};