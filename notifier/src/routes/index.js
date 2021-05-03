import { Router } from 'express';

// own
import subscription from './subscription.js';

export default () => {
  const app = Router();
  subscription(app);
  return app
}