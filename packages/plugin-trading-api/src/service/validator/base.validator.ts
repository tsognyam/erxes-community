const Joi = require('joi');
import { ErrorCode, CustomException } from '../../exception/error-code';
class BaseValidator {
  _joi;
  constructor() {
    this._joi = Joi;
  }
  validate = (joiObject: any, params: any) => {
    let { value, error } = this._joi.object(joiObject).validate(params);
    if (error) {
      const { details } = error;
      const message = details.map(i => i.message).join(',');
      throw new Error(message);
    }
    return { error, data: value };
  };
  isNumber = (value, helpers) => {
    if (typeof value !== 'number') {
      CustomException(ErrorCode.MustBeNumberException);
    }

    return value;
  };
}
export default BaseValidator;
