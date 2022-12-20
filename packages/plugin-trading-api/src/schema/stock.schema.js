const Joi = require('joi');
const Helper = require('../middleware/helper.middleware');


exports.createStock = (data) => {
   const { error } = Joi.object({
    stockcode: Joi.custom(Helper.isNumber, 'custom validation').required(),
    symbol: Joi.string().min(3).max(10).required(),
    stocktypeId: Joi.custom(Helper.isNumber, 'custom validation').required(),
    stockname: Joi.string().min(3).max(30).required(),
    stockprice: Joi.custom(Helper.isNumber, 'custom validation').required(),
    minprice: Joi.custom(Helper.isNumber, 'custom validation').required(),
    maxprice: Joi.custom(Helper.isNumber, 'custom validation').required(),
    openprice: Joi.custom(Helper.isNumber, 'custom validation').required(),
    closeprice: Joi.custom(Helper.isNumber, 'custom validation').required(),
    startdate: Joi.date().required(),
    enddate: Joi.date().greater(Joi.ref('startdate')).required(),
    intrate: Joi.custom(Helper.isNumber, 'custom validation').required(),
    userId: Joi.custom(Helper.isNumber, 'custom validation').required(),
    brchno: Joi.string().allow(''),
    status: Joi.string().required(),
    no: Joi.string().required(),
    cnt: Joi.custom(Helper.isNumber, 'custom validation').required(),
    boardname: Joi.string().required(),
    inducode: Joi.string().allow(''),
    lsttxndate: Joi.date(),
    ipo: Joi.string().required(),
    intrate2: Joi.custom(Helper.isNumber, 'custom validation'),
    externalid: Joi.string().allow(''),
    paytype: Joi.string().allow(''),
    multiplier: Joi.custom(Helper.isNumber, 'custom validation').allow(''),
    externalid2: Joi.string().allow(''),
    order_begindate: Joi.date(),
    order_enddate: Joi.date(),
    notiftype: Joi.custom(Helper.isNumber, 'custom validation').allow(''),
    stockfee: Joi.custom(Helper.isNumber, 'custom validation').required(),
    exchangeid: Joi.custom(Helper.isNumber, 'custom validation').required(),
}).validate(data);
// console.log(JSON.parse(data))

Helper.checkError(error);
}

exports.getStock = Joi.object({
  stockcode: Joi.custom(Helper.isNumber, 'custom validation').required(),
});

