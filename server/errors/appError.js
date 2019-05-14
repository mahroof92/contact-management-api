module.exports = class AppError extends Error {
  constructor(error) {
    super(error.message, error.status);
    this.message = error.message || 'Something went wrong';
    this.code = error.message || 'Something went wrong';
    this.name = this.constructor.name;
    this.status = error.status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
};
