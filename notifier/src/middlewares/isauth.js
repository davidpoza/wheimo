import get from 'lodash.get';
import fetch from 'node-fetch';
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
  let validated;
  try {
    validated = await fetch(`http://api:${config.port}/auth/validate?auth=${token}`);
  } catch (error) {
    throw new Error('User is not authenticated');
  }
  if (validated.status !== 200) throw new Error('User is not authenticated');
  const { userId } = await validated.json();
  req.user = userId;
  return next();
}