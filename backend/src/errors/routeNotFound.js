const HttpError = require('./http');

class RouteNotFound extends HttpError {
  constructor(params = {}) {
    super('RouteNotFound', 404, params);
  }
}

module.exports = RouteNotFound;
