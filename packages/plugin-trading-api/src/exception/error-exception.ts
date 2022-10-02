import ErrorCode from './error-code';

class ErrorException extends Error {
  _status: string | null = null;
  _message: string | null = null;
  constructor(code = '500', message = null, key = 'ErrorException') {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
    this._status = code;
    this._message = message;
    if (key !== 'ErrorException') {
      this._status = ErrorCode[key].status;
      this._message = message || ErrorCode[key].message;
    }
  }
}
export default ErrorException;
