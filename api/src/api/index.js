import { Router } from 'express';

// own
import auth from './routes/auth.js';

export default () => {
  const app = Router();
  auth(app);
  return app
}