const Joi = require('joi');
class BaseValidator {
  validate = (joiObject: any, params: any) => {
    let { value, error } = Joi.object(joiObject);
    if (error) {
      const { details } = error;
      const message = details.map(i => i.message).join(',');
      // throw new Error(message);
      throw new Error(message);
    }
    return { error, data: value };
  };
}
export default BaseValidator;
