interface data {
  status: number;
  message: string;
}
class ErrorException extends Error {
  _status: string | null = null;
  _message: string | null = null;
  constructor(data: data) {
    super(data.message.toString());
    Object.setPrototypeOf(this, new.target.prototype);
    this._status = data.status.toString();
    this._message = data.message;
  }
}
export default ErrorException;
