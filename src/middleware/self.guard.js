export const SelfGuard = (req, res, next) => {
  try {
    const { user } = req;
    const { id: requestedId } = req.params;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
        statusCode: 401
      });
    }

    if (user.role === 'superAdmin' || user.userId === requestedId) {
      next();
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only access your own resources',
        statusCode: 403
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
