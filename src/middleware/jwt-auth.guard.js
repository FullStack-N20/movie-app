import jwt from 'jsonwebtoken';

export const JwtAuthGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'No authorization header provided',
        statusCode: 401
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid authorization header format',
        statusCode: 401
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided',
        statusCode: 401
      });
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    
    if (!decodedData || !decodedData.userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token payload',
        statusCode: 401
      });
    }

    req.user = decodedData;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired',
        statusCode: 401
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        statusCode: 401
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
