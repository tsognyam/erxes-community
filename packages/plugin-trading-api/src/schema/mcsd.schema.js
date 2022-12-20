const Joi = require('joi');
const cityRepo = require('../repository/user/city.repository');
const districtRepo = require('../repository/user/district.repository');
const ErrorCode = require('../exception/error-code');
const Helper = require('../middleware/helper.middleware');

const checkParams = (data) => {
    const { error } = Joi.object({
        BeginDate: Joi.date().required(),
        EndDate: Joi.date().required(),
    }).validate(data);

    Helper.checkError(error);
};

const checkSetAccount = (data) => {
    const { error } = Joi.object({
        BDCAccountId: Joi.string().max(30).required(),
        BDCAccountNumber: Joi.string().max(8).required(),
        RegistryNumber: Joi.string().max(50).required(),
        FirstName: Joi.string().required(),
        LastName: Joi.string().required(),
        BirthDate: Joi.date().required(),
        Country: Joi.string().required(),
        Gender: Joi.string().valid('Male','Female').required(),
        HomePhone: Joi.string().max(20).required(),
        MobilePhone: Joi.string().max(20).required(),
        Occupation: Joi.string().max(200).required(),
        HomeAddress: Joi.string().max(200).required(),
        CustomerType: Joi.number().valid(0,1).required(),
        BankCode: Joi.string().max(10).required(),
        BankName: Joi.string().max(150).required(),
        BankAccountNumber: Joi.string().max(20).required(),
        FeeEquity: Joi.number().required(),
        FeeDebt: Joi.number().required(),
        FeeCorpDebt: Joi.number().required()
    }).validate(data);

    Helper.checkError(error);
};
exports.GetAccounts = async (data) => {
    checkParams(data);

};

exports.SetAccounts = async (data) => {
    checkSetAccount(data);

};

exports.UpdateAccounts = async (data) => {
    checkSetAccount(data);

};
