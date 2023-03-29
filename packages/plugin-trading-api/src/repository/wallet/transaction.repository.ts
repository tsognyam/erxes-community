import BaseRepository from '../base.repository';
import { TransactionConst, WalletConst } from '../../constants/wallet';
import * as moment from 'moment';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
export default class TransactionRepository extends BaseRepository {
  constructor() {
    super('transaction');
  }
  statement = async (data: any) => {
    return await this._prisma[this._model].findMany(
      {
        where: {
          walletId: data.walletId,
          status: {
            in: [TransactionConst.STATUS_SUCCESS]
          },
          type: {
            in: [TransactionConst.TYPE_W2W, TransactionConst.TYPE_WITHDRAW]
          },
          dater: {
            gte: data.startDate,
            lt: data.endDate
          }
        },
        skip: data.skip,
        take: data.take,
        orderBy: {
          dater: 'desc'
        }
      },
      {
        include: {
          Order: {
            symbol: true
          }
        }
      }
    );
  };

  settlementTransaction = async (data: any) => {
    return await this._prisma[this._model].findMany({
      where: {
        walletId: data.walletId,
        status: TransactionConst.STATUS_SUCCESS,
        dater: {
          from_gre: data.startDate,
          to_lte: data.endDate
        }
      }
    });
  };
  transactionStatement = async (params: any) => {
    let dateFilter = '',
      filter = '';
    if (params.startDate != undefined && params.endDate != undefined) {
      dateFilter =
        " and tr.dater between '" +
        moment(params.startDate).format('YYYY-MM-DD') +
        "' and '" +
        moment(params.endDate).format('YYYY-MM-DD') +
        "'";
    }
    if (params.walletId) {
      filter += ` and tr.walletId=${params.walletId} `;
    }
    if (params.userId) {
      filter += ` and wl.userId='${params.userId}'`;
    }
    let paginationFilter = ` limit ` + params.take + ` offset ` + params.skip;
    let sql =
      `
    SELECT tr.dater,tr.createdAt,tr.description,tr.walletId,tr.type,tr.beforeBalance,tr.afterBalance,
    mcsd.prefix,
	case 
    when (tr.type=1 and tr.status=1) then tr.amount
    when (tr.type=3 and tr.status=1) then tr.amount
    else 0 end as income,
    case when (tr.type=2  and tr.status=1) then tr.amount*-1
    when (tr.type=4 and tr.status=1) then tr.amount*-1
	else 0 end as outcome,
	case  
    when (tr.type=1 and tr.status=2) then tr.amount
    when (tr.type=3 and tr.status=2) then tr.amount
    else 0 end as expectedIncome,
    case 
    when (tr.type=2 and tr.status=2) then tr.amount*-1 
    when (tr.type=4 and tr.status=2) then tr.amount*-1 
    else 0 end as expectedOutcome
    FROM \`Transaction\` tr 
    inner join \`Wallet\` wl on wl.id=tr.walletId 
    inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
    where wl.type!=${WalletConst.NOMINAL} and wl.type!=${WalletConst.NOMINAL_FEE} and (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${TransactionConst.STATUS_PENDING})` +
      dateFilter +
      filter +
      ' order by tr.dater,tr.createdAt' +
      paginationFilter;
    let statementList = await this._prisma.$queryRaw(Prisma.raw(sql));
    let dataList = {
      total: statementList.length,
      count: statementList.length,
      values: statementList
    };
    return dataList;
  };
  transactionStatementSummary = async (params: any) => {
    let dateFilter = '',
      filter = '';
    if (params.startDate != undefined && params.endDate != undefined) {
      dateFilter =
        " and tr.dater between '" +
        moment(params.startDate).format('YYYY-MM-DD') +
        "' and '" +
        moment(params.endDate).format('YYYY-MM-DD') +
        "'";
    }
    if (params.walletId) {
      filter += ` and tr.walletId=${params.walletId} `;
    }
    if (params.userId) {
      filter += ` and wl.userId='${params.userId}'`;
    }
    let sql =
      `SELECT SUM(case 
    when (tr.type=1 and tr.status=1) then tr.amount
    when (tr.type=3 and tr.status=1) then tr.amount
    else 0 end) as income,
    SUM(case when (tr.type=2  and tr.status=1) then tr.amount*-1
    when (tr.type=4 and tr.status=1) then tr.amount*-1
	else 0 end) as outcome,
	SUM(case  
    when (tr.type=1 and tr.status=2) then tr.amount
    when (tr.type=3 and tr.status=2) then tr.amount
    else 0 end) as expectedIncome,
    SUM(case 
    when (tr.type=2 and tr.status=2) then tr.amount*-1 
    when (tr.type=4 and tr.status=2) then tr.amount*-1 
    else 0 end) as expectedOutcome
    FROM \`Transaction\` tr 
    inner join \`Wallet\` wl on wl.id=tr.walletId 
    inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
    where wl.type!=${WalletConst.NOMINAL} and wl.type!=${WalletConst.NOMINAL_FEE} and (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${TransactionConst.STATUS_PENDING})` +
      dateFilter +
      filter;
    let resultList = await this._prisma.$queryRaw(Prisma.raw(sql));
    let beginBalanceSql =
      `SELECT IFNULL(sum(tr.amount),0) as beginBalance
      FROM \`Transaction\` tr 
      inner join \`Wallet\` wl on wl.id=tr.walletId 
      inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
      where wl.type!=${WalletConst.NOMINAL} and wl.type!=${
        WalletConst.NOMINAL_FEE
      } and 
      (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${
        TransactionConst.STATUS_PENDING
      }) and 
      tr.dater<'${moment(params.startDate).format('YYYY-MM-DD')}'` + filter;
    let beginBalance;
    if (!!params.startDate)
      beginBalance = await this._prisma.$queryRaw(Prisma.raw(beginBalanceSql));
    else
      beginBalance = [
        {
          beginBalance: 0
        }
      ];
    let endBalanceSql =
      `SELECT IFNULL(sum(tr.amount),0) as endBalance
    FROM \`Transaction\` tr 
    inner join \`Wallet\` wl on wl.id=tr.walletId 
    inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
    where wl.type!=${WalletConst.NOMINAL} and wl.type!=${
        WalletConst.NOMINAL_FEE
      } and 
    (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${
        TransactionConst.STATUS_PENDING
      }) and 
    tr.dater<='${moment(params.endDate).format('YYYY-MM-DD')}'` + filter;
    let endBalance;
    if (!!params.endDate)
      endBalance = await this._prisma.$queryRaw(Prisma.raw(endBalanceSql));
    else
      endBalance = [
        {
          endBalance:
            resultList.length > 0
              ? resultList[0].income -
                resultList[0].outcome +
                resultList[0].expectedIncome -
                resultList[0].expectedOutcome
              : 0
        }
      ];
    if (resultList.length > 0) {
      return {
        ...resultList[0],
        ...beginBalance[0],
        ...endBalance[0]
      };
    }
    return {
      income: 0,
      outcome: 0,
      expectedIncome: 0,
      expectedOutcome: 0,
      beginBalance: 0,
      endBalance: 0
    };
  };
}
