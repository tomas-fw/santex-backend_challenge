const HttpError = require('./http');

class InternalServerError extends HttpError {
  constructor() {
    super('InternalServer', 500);
  }
}

module.exports = InternalServerError;
