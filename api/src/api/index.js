import { Router } from 'express';

// own
import auth from './routes/auth.js';
import user from './routes/user.js';
import account from './routes/account.js';
import transaction from './routes/transaction.js';
import tag from './routes/tag.js';
import rule from './routes/rule.js';
import recurrent from './routes/recurrent.js';
import budget from './routes/budget.js';
import attachment from './routes/attachment.js';
import total from './routes/total.js';
import nordigen from './routes/nordigen.js';
import log from './routes/log.js';

export default () => {
  const app = Router();
  auth(app);
  user(app);
  account(app);
  transaction(app);
  tag(app);
  rule(app);
  recurrent(app);
  budget(app);
  attachment(app);
  total(app);
  nordigen(app);
  log(app);
  return app
}