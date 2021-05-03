import { Container } from 'typedi';
import get from 'lodash.get';
import jwt from 'jsonwebtoken';

import config from '../config/config.js';

/**
 * @TODO: en este middleware hago una validación del token recibido como query param
 * usando para ello el endpoint /auth/validate del contenedor "api".
 */
export default async (req, res, next) => {
  if (!req.query.auth) {
      return res.sendStatus(403);
  }
  const token = req.query.auth;
  const validated = await fetch(`http://api:3001/auth/validate?auth=${token}`);
  if (validated.status !== 200) throw new Error('User is not authenticated');
  return next();
}