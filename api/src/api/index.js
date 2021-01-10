import { Router } from 'express';

// own
import auth from './routes/auth.js';
import user from './routes/user.js';

export default () => {
  const app = Router();
  auth(app);
  user(app);
  return app
}