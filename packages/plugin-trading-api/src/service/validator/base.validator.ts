const Joi = require('joi');
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
}
export default BaseValidator;
