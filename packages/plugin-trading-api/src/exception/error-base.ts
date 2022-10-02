class BaseError extends Error {
  statusCode: any;
  isOperational: any;
  constructor(
    name: any,
    statusCode: any,
    isOperational: any,
    description: any
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}
export default BaseError;
