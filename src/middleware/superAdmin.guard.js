export const SuperAdminGuard = (req, res, next) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
        statusCode: 401,
      });
    }

    if (user.role !== 'superAdmin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. SuperAdmin privileges required',
        statusCode: 403,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};
