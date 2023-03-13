class HttpError extends Error {
  constructor(name = 'Internal Server Error', status = 500, params = {}) {
    super(name);

    this.name = name;
    this.status = status;
    this.params = params;
    this.message = this.message || 'Internal Server Error';
  }
}

module.exports = HttpError;
