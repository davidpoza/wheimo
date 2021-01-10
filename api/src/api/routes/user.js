import { Router } from 'express';

// own
import AuthService from '../../services/auth.js';
import UserService from '../../services/user.js';

const route = Router();

export default (app) => {
  app.use('/user', route);
  route.get('/', (req, res, next) => {
    res.send('hello world');
  });
  route.post('/', async (req, res, next) => {
    const userService = new UserService();
    await userService.create(
      { email: 'pozasuarez@gmail.com', name: 'prueba', password: '1234', active: true, level: 'admin' }
    );
    res.send('usuario creado');
  });

};