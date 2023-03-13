const { MongoError } = require('mongodb');

const HttpError = require('../errors/http');
const InternalServerError = require('../errors/internalServer');
const Utils = require('../utils');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  let errors;

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('REQUESTED_ENDPOINT', req.originalUrl, '\n', 'ERROR_HANDLED', err);
  }

  if (err instanceof Array) {
    errors = err;
  } else if (err instanceof HttpError) {
    errors = [err];
  } else if (err instanceof MongoError) {
    if (err.code === 11000) {
      const field = Utils.capitalizeEach(
        err.message.split('index:')[1].split('dup key')[0].split('_')[0],
      );
      errors = [new HttpError('DuplicatedField', 422, { field })];
    } else {
      errors = [new InternalServerError()];
    }
  } else {
    errors = [new InternalServerError()];
  }

  const error = errors[0];

  res.status(error.status).json({
    error: {
      errors,
      code: error.status,
      messages: error.message,
    },
  });
};

module.exports = errorMiddleware;
