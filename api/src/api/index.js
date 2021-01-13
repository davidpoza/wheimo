import { Router } from 'express';

// own
import auth from './routes/auth.js';
import user from './routes/user.js';
import account from './routes/account.js';
import transaction from './routes/transaction.js';
import tag from './routes/tag.js';

export default () => {
  const app = Router();
  auth(app);
  user(app);
  account(app);
  transaction(app);
  tag(app);
  return app
}