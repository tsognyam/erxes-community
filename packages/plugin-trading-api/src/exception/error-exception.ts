// import ErrorCode from './error-code';
interface data {
  status: number;
  message: string;
}
class ErrorException extends Error {
  _status: string | null = null;
  _message: string | null = null;
  constructor(data: any) {
    super(data.message);
    Object.setPrototypeOf(this, new.target.prototype);
    this._status = data.code;
    this._message = data.message;
    // if (key !== 'ErrorException') {
    //   this._status = ErrorCode[key].status;
    //   this._message = message || ErrorCode[key].message;
    // }
  }
}

export default ErrorException;
