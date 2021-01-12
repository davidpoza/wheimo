import { Container } from 'typedi';
import get from 'lodash.get';
import jwt from 'jsonwebtoken';

import config from '../../config/config.js';

export default (req, res, next) => {
  if (!req.headers.authorization) {
      return res.sendStatus(403);
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, config.jwtSecret, { algorithms: [ config.jwtAlgorithm ]}, async (err, payload) => {
    if (err) { // checks validity and expiration.
      return res.sendStatus(403);
    } else {
      const sequelize = Container.get('sequelizeInstance');
      const userModel = sequelize.models.users;
      try {
        const user = await userModel.findOne({ where: { id: get(payload, 'sub', '') } });
        if (!user) {
          return res.sendStatus(403);
        }
        req.user = user;
        return next();
      } catch (err) {
        throw new Error(err);
      }
    }
  });
}