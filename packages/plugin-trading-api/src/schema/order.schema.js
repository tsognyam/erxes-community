const Joi = require('joi');
const Helper = require('../middleware/helper.middleware');


exports.createOrder = (data) => {
   const { error } = Joi.object({
    ordertype: Joi.custom(Helper.isNumber, 'custom validation').required(),
    txntype: Joi.custom(Helper.isNumber, 'custom validation').required(),
    // acntno: Joi.custom(Helper.isNumber, 'custom validation').required(),
    // orderno: Joi.string().required(),
    stockcode: Joi.custom(Helper.isNumber, 'custom validation').required(),
    // txndate: Joi.date().required(),
    cnt: Joi.custom(Helper.isNumber, 'custom validation').required(),
    price: Joi.custom(Helper.isNumber, 'custom validation').required(),
    fee: Joi.custom(Helper.isNumber, 'custom validation').required(),
    donedate: Joi.date(),
    donecnt: Joi.custom(Helper.isNumber, 'custom validation'),
    doneprice: Joi.custom(Helper.isNumber, 'custom validation'),
    startdate: Joi.date().required(),
    enddate: Joi.date().required(),
    descr: Joi.string(),
    descr2: Joi.string(),
    txnsource: Joi.custom(Helper.isNumber, 'custom validation').required(),
    condid: Joi.custom(Helper.isNumber, 'custom validation').required(),
    // userId: Joi.custom(Helper.isNumber, 'custom validation').required(),
    brchno: Joi.string(),
    updatedate: Joi.date(),
    updateUserId: Joi.custom(Helper.isNumber, 'custom validation'),
    ostatus: Joi.string(),
    tradecode: Joi.string(),
    yield: Joi.custom(Helper.isNumber, 'custom validation'),
    msgid: Joi.custom(Helper.isNumber, 'custom validation'),
    ipaddress: Joi.string(),
    filename: Joi.string(),
    executionid: Joi.string(),
    orderid: Joi.string()
}).validate(data);
// console.log(JSON.parse(data))

Helper.checkError(error);
}

exports.getOrder = Joi.object({
  id: Joi.custom(Helper.isNumber, 'custom validation').required(),
});

