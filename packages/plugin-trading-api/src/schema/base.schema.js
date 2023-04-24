const Joi = require('joi');
// const ErrorCode = require('../exception/error-code');
const ErrorException = require('../exception/error-exception');
// const Helper = require('../middleware/helper.middleware');
import Helper from '../middleware/helper.service'
// const CityRepository = require('../repository/user/city.repository');

class BaseSchema {
  REGISTER_NUMBER_PATTERN = RegExp(/^[А-Яа-я]{2}[0-9]{8}$/);
  PASSWORD_POLICY = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);

  Joi = Joi;
  helper = Helper;
  // #cityRepository = new CityRepository();

  validateId = (id) => {
    const { error } = this.Joi.object({
      id: this.Joi.custom(Helper.isNumber, 'custom validation').required(),
    }).validate({ id: +id });

    this.helper.checkError(error);
  };

  validateStatus = (status) => {
    const { error } = this.Joi.object({
      status: this.Joi.custom(Helper.isNumber, 'custom validation'),
    }).validate({ status: +status });

    this.helper.checkError(error);
  };

  validateParams = (data) => {
    const { error } = this.Joi.object({
      name: this.Joi.string().min(1).max(30).required(),
      name2: this.Joi.string().min(1).max(30),
      createdUserId: this.Joi.custom(Helper.isNumber, 'custom validation'),
    }).validate(data);

    this.helper.checkError(error);
  };

  validateUpdateParams = (data) => {
    const { error } = this.Joi.object({
      id: this.Joi.custom(Helper.isNumber, 'custom validation').required(),
      name: this.Joi.string().min(1).max(30),
      name2: this.Joi.string().min(1).max(30),
      status: this.Joi.custom(Helper.isNumber, 'custom validation').valid(1, 2),
      updatedUserId: this.Joi.custom(Helper.isNumber, 'custom validation'),
    }).validate(data);

    this.helper.checkError(error);
  };

  // checkCity = async (id) => {
  //   const city = await this.#cityRepository.findById(id);
  //   if (!city) {
  //     throw new ErrorException(500, ErrorCode.InvalidParam);
  //   }

  //   return city;
  // };

  validateRegNumber = async (registerNumber) => {
    const { error } = this.Joi.object({
      registerNumber: this.Joi.string()
        .min(1)
        .max(10)
        .regex(this.REGISTER_NUMBER_PATTERN)
        .required(),
    }).validate({ registerNumber });

    this.helper.checkError(error);
  };
}

module.exports = BaseSchema;
