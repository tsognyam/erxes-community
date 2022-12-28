import BaseValidator from './base.validator';
const Joi = require('joi');
// import Joi from 'joi'
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
        BeginDate: Joi.date().default(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        ),
        EndDate: Joi.date().default(new Date())
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
        mitPrefix: Joi.string(),
        userId: Joi.custom(this.isNumber, 'custom validation'),
        transactionDate: Joi.object({
          gt: Joi.date(),
          gte: Joi.date(),
          lt: Joi.date(),
          lte: Joi.date()
        }).required(),
        skip: Joi.custom(this.isNumber, 'custom validation'),
        take: Joi.custom(this.isNumber, 'custom validation'),
        orderBy: Joi.any()
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
}
