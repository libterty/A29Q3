const ECONNRESET = (req, res, next) => {
  try {
    process.on('uncaughtException', err => {
      console.log(err.stack);
      console.log('Not exit...');
    });
    next();
  } catch (error) {
    next(error);
  }
};

const notFound = (req, res, next) => {
  const error = new Error('404, Page not found.');
  error.status = 404;
  next(error);
};

const logErrors = (req, res, error) => {
  res.status(error.status || 500);
  res.send(error.message);
};

module.exports = { ECONNRESET, notFound, logErrors };
