import { Router } from 'express';
import { Container } from 'typedi';

import middlewares from '../middlewares/index.js';

const route = Router();

export default (app) => {
  app.use('/users', route);

  route.post('/', async (req, res, next) => {
    const userService = Container.get('userService');
    await userService.create(
      { email: 'pozasuarez@gmail.com', name: 'prueba', password: '1234', active: true, level: 'admin' }
    );
    res.send('usuario creado');
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