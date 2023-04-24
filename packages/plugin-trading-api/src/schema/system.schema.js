const Joi = require('joi');
const systemRepo = require('../repository/system.repository');
const ErrorCode = require('../exception/error-code');
const Helper = require('../middleware/helper.middleware');
const ErrorException = require('../exception/error-exception');

const check = async (id) => {
  const item = await systemRepo.get(id);
  if (!item) {
    throw new ErrorException(500, ErrorCode.InvalidParam);
  }

  return item;
};

exports.add = async (data) => {
  const { error } = Joi.object({
    name: Joi.string().required(),
    value: Joi.string().required(),
    updateddate: Joi.date(),
    updatedby: Joi.number().required(),
  }).validate(data);

  // Helper.checkError(error);
};

exports.id = (id) => {
  const { error } = Joi.object({
    id: Joi.number().required(),
  }).validate({ id });

  Helper.checkError(error);
};

exports.status = (status) => {
  const { error } = Joi.object({
    status: Joi.number().valid(1, 2),
  }).validate({ status });

  Helper.checkError(error);
};

exports.update = async (params) => {
  const { data, error } = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    value: Joi.string().required(),
    updateddate: Joi.date(),
    updatedby: Joi.number().required(),
  }).validate(params);

  Helper.checkError(error);

  await check(params.id);
};
