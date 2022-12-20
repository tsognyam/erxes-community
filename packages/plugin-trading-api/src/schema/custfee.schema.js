const Joi = require('joi');
const custfeeRepo = require('../repository/custfee.repository');
const ErrorCode = require('../exception/error-code');
const Helper = require('../middleware/helper.middleware');

const check = async id => {
  const custfee = await custfeeRepo.get(id);
  if (!custfee) {
    throw new Error(ErrorCode.InvalidParam);
  }

  return custfee;
};

exports.add = async data => {
  const { error } = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    name2: Joi.string(),
    userId: Joi.number().integer().required(),
    stocktypeId: Joi.number().integer().required(),
    value: Joi.number(),
    sidetype: Joi.number().required(),
    desc: Joi.any(),
    status: Joi.number(),
  }).validate(data);

  // Helper.checkError(error);
};

exports.id = id => {
  const { error } = Joi.object({
    id: Joi.number().required(),
  }).validate({ id });

  Helper.checkError(error);
};

exports.status = status => {
  const { error } = Joi.object({
    status: Joi.number().valid(1, 2),
  }).validate({ status });

  Helper.checkError(error);
};

exports.update = async data => {
  const { error } = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    name2: Joi.string(),
    userId: Joi.number().integer().required(),
    stocktypeId: Joi.number().integer().required(),
    value: Joi.number(),
    sidetype: Joi.number().required(),
    desc: Joi.any(),
    updateddate: Joi.date(),
    updatedby: Joi.any(),
    status: Joi.number(),
  }).validate(data);

  Helper.checkError(error);

  await check(data.id);
};
