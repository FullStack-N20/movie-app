import jwt from 'jsonwebtoken';
import { catchError } from '../utils/error-response.js';

const jwtAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (err) {
      catchError(res, 500, err.message);
  }
};

export default jwtAuth;