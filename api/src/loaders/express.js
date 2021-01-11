import bodyParser from 'body-parser';
import cors from 'cors';
import { errors } from 'celebrate';

// own
import routes from '../api/index.js';
import config from '../config/config.js';

export default ({ app }) => {
  // It shows the real origin IP if behind proxy
  app.enable('trust proxy');
  app.use(cors());
  app.use(bodyParser.json());
  app.use(config.api.prefix, routes());
  app.use(errors());
};