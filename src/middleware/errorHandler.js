const errorHandler = (err, _, res) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
};

export default errorHandler;