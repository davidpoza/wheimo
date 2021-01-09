import { Router } from 'express';

// own
import AuthService from '../../services/auth.js';

const route = Router();

export default (app) => {
  app.use('/auth', route);
  route.get('/', (req, res, next) => {
    res.send('hello world');
  });

};