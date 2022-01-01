import { Container } from 'typedi';
import get from 'lodash.get';
import jwt from 'jsonwebtoken';

import config from '../../config/config.js';

/**
 * This middleware can take auth token from headers or from query parameter
 */
export default (req, res, next) => {
  if (!req.headers.authorization && !req.query.auth) {
    return res.sendStatus(403);
  }
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    token = req.query.auth;
    console.log('se usa el token de la url', token)
  }
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
        // injection of user into request
        req.user = user.dataValues;
        return next();
      } catch (err) {
        throw new Error(err);
      }
    }
  });
}