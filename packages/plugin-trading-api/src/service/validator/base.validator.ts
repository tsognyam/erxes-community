// const Joi = require('joi');
import * as Joi from 'joi';
import { ErrorCode, CustomException } from '../../exception/error-code';
class BaseValidator {
  _joi = Joi;
  constructor() {}
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
