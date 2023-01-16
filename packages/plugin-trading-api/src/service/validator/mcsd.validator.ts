import BaseValidator from './base.validator';
// const { DuplicateException } = require('../../exception/error');
import UserRepository from '../../repository/user/user.repository';
import TransactionMCSDRepository from '../../repository/mcsd.repository';
import Helper from '../../middleware/helper.service';
export default class TransactionMCSDValidator extends BaseValidator {
  _transactionMCSDRepository = new TransactionMCSDRepository();
  _userRepository = new UserRepository();
  validateSaveTransaction = async params => {
    var { error, data } = this.validate(
      {
        BeginDate: this._joi
          .date()
          .default(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
        EndDate: this._joi.date().default(new Date())
      },
      params
    );
    data.BeginDate = Helper.dateToString(data.BeginDate, true);
    data.EndDate = Helper.dateToString(data.EndDate, true);
    let today = new Date(data.BeginDate);
    today.setUTCHours(0, 0, 0, 0);
    let tomorrow = new Date(
      new Date(data.EndDate).getTime() + 24 * 60 * 60 * 1000
    );
    tomorrow.setUTCHours(0, 0, 0, 0);
    let transactions = await this._transactionMCSDRepository.findAll(
      {
        transactionDate: {
          gte: new Date(today),
          lt: new Date(tomorrow)
        }
      },
      undefined
    );
    console.log('transactions', today, tomorrow, transactions);
    if (transactions.count != 0) {
      throw new Error('Duplicate error');
    }
    return data;
  };
  validateGet = async params => {
    var { error, data } = this.validate(
      {
        mitPrefix: this._joi.string(),
        userId: this._joi.custom(this.isNumber, 'custom validation'),
        transactionDate: this._joi
          .object({
            gt: this._joi.date(),
            gte: this._joi.date(),
            lt: this._joi.date(),
            lte: this._joi.date()
          })
          .required(),
        skip: this._joi.custom(this.isNumber, 'custom validation'),
        take: this._joi.custom(this.isNumber, 'custom validation'),
        orderBy: this._joi.any()
      },
      params
    );
    let options: any = [];
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    data.skip = undefined;
    data.take = undefined;
    data.orderBy = undefined;
    if (data.userId) {
      let user = await this._userRepository.findById(data.userId);
      data.mitPrefix = user.UserMCSDAccount[0].prefix;
    }
    data.userId = undefined;
    let transactions: any = await this._transactionMCSDRepository.findAll(
      data,
      undefined,
      options
    );
    let beginBalance = await this._transactionMCSDRepository._prisma
      .$queryRaw`SELECT IFNULL(sum(case when tr.transactionTypeId in (11,30,40,50,61) then (tr.securitiesQuantity) when tr.transactionTypeId in (10,20,41,51,52,53,60) then (tr.securitiesQuantity * -1) end),0) AS securitiesQuantity,tr.securitiesCode,tr.mitPrefix
        FROM \`TransactionMCSD\` tr
        WHERE tr.transactionDate < ${data.transactionDate.gte}
        and tr.mitPrefix = ${data.mitPrefix}
        GROUP BY tr.mitPrefix, tr.securitiesCode
        `;
    let endBalance = await this._transactionMCSDRepository._prisma
      .$queryRaw`select ifnull(sum(ss.securitiesQuantity),0) securitiesQuantity, ss.securitiesCode, ss.mitPrefix from (SELECT IFNULL(sum(case when tr.transactionTypeId in (11,30,40,50,61) then (tr.securitiesQuantity) when tr.transactionTypeId in (10,20,41,51,52,53,60) then (tr.securitiesQuantity * -1) end),0) AS securitiesQuantity,tr.securitiesCode,tr.mitPrefix
        FROM \`TransactionMCSD\` tr
        WHERE tr.transactionDate < ${data.transactionDate.gte}
        and tr.mitPrefix = ${data.mitPrefix}
        GROUP BY tr.mitPrefix, tr.securitiesCode
        UNION all SELECT IFNULL(SUM(case when tr.transactionTypeId in (11,30,40,50,61) then (tr.securitiesQuantity) when tr.transactionTypeId in (10,20,41,51,52,53,60) then (tr.securitiesQuantity * -1) end),0) AS securitiesQuantity,tr.securitiesCode,tr.mitPrefix
        FROM \`TransactionMCSD\` tr
        WHERE tr.transactionDate between ${data.transactionDate.gte} and ${data.transactionDate.lte}
        and tr.mitPrefix = ${data.mitPrefix}
        GROUP BY tr.mitPrefix, tr.securitiesCode) ss group by ss.securitiesCode, ss.mitPrefix
        `;
    transactions.beginBalance = beginBalance;
    transactions.endBalance = endBalance;
    return transactions;
  };
  checkParams = data => {
    const { error } = this._joi
      .object({
        BeginDate: this._joi.date().required(),
        EndDate: this._joi.date().required()
      })
      .validate(data);

    Helper.checkError(error);
  };

  checkSetAccount = data => {
    const { error } = this._joi
      .object({
        BDCAccountId: this._joi
          .string()
          .max(30)
          .required(),
        BDCAccountNumber: this._joi
          .string()
          .max(8)
          .required(),
        RegistryNumber: this._joi
          .string()
          .max(50)
          .required(),
        FirstName: this._joi.string().required(),
        LastName: this._joi.string().required(),
        BirthDate: this._joi.date().required(),
        Country: this._joi.string().required(),
        Gender: this._joi
          .string()
          .valid('Male', 'Female')
          .required(),
        HomePhone: this._joi
          .string()
          .max(20)
          .required(),
        MobilePhone: this._joi
          .string()
          .max(20)
          .required(),
        Occupation: this._joi
          .string()
          .max(200)
          .required(),
        HomeAddress: this._joi
          .string()
          .max(200)
          .required(),
        CustomerType: this._joi
          .number()
          .valid(0, 1)
          .required(),
        BankCode: this._joi
          .string()
          .max(10)
          .required(),
        BankName: this._joi
          .string()
          .max(150)
          .required(),
        BankAccountNumber: this._joi
          .string()
          .max(20)
          .required(),
        FeeEquity: this._joi.number().required(),
        FeeDebt: this._joi.number().required(),
        FeeCorpDebt: this._joi.number().required()
      })
      .validate(data);

    Helper.checkError(error);
  };
  GetAccounts = async data => {
    this.checkParams(data);
  };

  SetAccounts = async data => {
    this.checkSetAccount(data);
  };

  UpdateAccounts = async data => {
    this.checkSetAccount(data);
  };
}
