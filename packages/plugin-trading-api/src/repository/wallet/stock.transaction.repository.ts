import BaseRepository from '../base.repository';
import { TransactionConst, WalletConst } from '../../constants/wallet';
import * as moment from 'moment';
import { Prisma } from '@prisma/client';

export default class StockTransactionRepository extends BaseRepository {
  constructor() {
    super('stockTransaction');
  }
  stockTransactionStatement = async (params: any) => {
    let dateFilter = '';
    if (params.startDate != undefined && params.endDate != undefined) {
      dateFilter =
        " and str.dater between '" +
        moment(params.startDate).format('YYYY-MM-DD') +
        "' and '" +
        moment(params.endDate).format('YYYY-MM-DD') +
        "'";
    }
    let filter = '';
    if (!!params.walletId) {
      filter = ` and str.walletId=${params.walletId} `;
    }
    if (!!params.userId) {
      filter = ` and wl.userId='${params.userId}'`;
    }
    if (!!params.stockcode) {
      filter = ` and st.stockcode=${params.stockcode}`;
    }
    let paginationFilter = ` limit ` + params.take + ` offset ` + params.skip;
    let selectSql = ` SELECT str.dater,str.createdAt,str.description,str.walletId,str.type,mcsd.prefix,
    CAST((case
    when (str.type=1 and str.status=1) then str.stockCount
    when (str.type=3 and str.status=1) then str.stockCount
    else 0 end) AS DECIMAL(30,0))  as income,
    CAST((case
    when (str.type=2  and str.status=1) then str.stockCount*-1
    when (str.type=4 and str.status=1) then str.stockCount*-1
    else 0 end) AS DECIMAL(30,0)) as outcome,
    CAST((case
    when (str.type=1 and str.status=2) then str.stockCount
    when (str.type=3 and str.status=2) then str.stockCount
    else 0 end) AS DECIMAL(30,0)) as expectedIncome,
    CAST((case 
    when (str.type=2 and str.status=2) then str.stockCount*-1 
    when (str.type=4 and str.status=2) then str.stockCount*-1 
    else 0 end) AS DECIMAL(30,0)) as expectedOutcome,
    st.stockcode,st.stockname,st.symbol,str.fee,str.price `;
    let sql =
      `
      FROM \`StockTransaction\` str 
      inner join \`Wallet\` wl on wl.id=str.walletId
      inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
      inner join \`Stock\` st on st.stockcode = str.stockCode
      where wl.type!=${WalletConst.NOMINAL} and wl.type!=${WalletConst.NOMINAL_FEE} and (str.status=${TransactionConst.STATUS_ACTIVE} or str.status=${TransactionConst.STATUS_PENDING})` +
      dateFilter +
      filter +
      ' order by str.createdAt,str.dater desc';
    let statementList = await this._prisma.$queryRaw(
      Prisma.raw(selectSql + sql + paginationFilter)
    );
    let totalCount = await this._prisma.$queryRaw(
      Prisma.raw(
        'select CAST(count(str.walletId) as DECIMAL(30,0)) as count ' + sql
      )
    );
    let dataList = {
      total: totalCount[0].count,
      count: statementList.length,
      values: statementList
    };
    return dataList;
  };
  stockTransactionStatementSummary = async (params: any) => {
    let dateFilter = '',
      filter = '';
    if (params.startDate != undefined && params.endDate != undefined) {
      dateFilter =
        " and str.dater between '" +
        moment(params.startDate).format('YYYY-MM-DD') +
        "' and '" +
        moment(params.endDate).format('YYYY-MM-DD') +
        "'";
    }
    if (params.walletId) {
      filter += ` and str.walletId=${params.walletId} `;
    }
    if (params.userId) {
      filter += ` and wl.userId='${params.userId}'`;
    }
    let sql =
      `SELECT SUM(case 
    when (str.type=1 and str.status=1) then str.stockCount
    when (str.type=3 and str.status=1) then str.stockCount
    else 0 end) as income,
    SUM(case when (str.type=2  and str.status=1) then str.stockCount
    when (str.type=4 and str.status=1) then str.stockCount
  else 0 end) as outcome,
  SUM(case  
    when (str.type=1 and str.status=2) then str.stockCount
    when (str.type=3 and str.status=2) then str.stockCount
    else 0 end) as expectedIncome,
    SUM(case 
    when (str.type=2 and str.status=2) then str.stockCount 
    when (str.type=4 and str.status=2) then str.stockCount 
    else 0 end) as expectedOutcome
    FROM \`StockTransaction\` str 
      inner join \`Wallet\` wl on wl.id=str.walletId
      inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
      inner join \`Stock\` st on st.stockcode = str.stockCode
      where wl.type!=${WalletConst.NOMINAL} and wl.type!=${WalletConst.NOMINAL_FEE} and (str.status=${TransactionConst.STATUS_ACTIVE} or str.status=${TransactionConst.STATUS_PENDING})` +
      dateFilter +
      filter;
    let resultList = await this._prisma.$queryRaw(Prisma.raw(sql));
    console.log(resultList);
    let beginBalanceSql =
      `SELECT IFNULL(SUM(str.stockCount),0) AS beginBalance
    FROM \`StockTransaction\` str 
    inner join \`Wallet\` wl on wl.id=str.walletId
    inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
    inner join \`Stock\` st on st.stockcode = st.stockcode
    WHERE str.dater<${moment(params.startDate).format(
      'YYYY-MM-DD'
    )} AND str.status=${TransactionConst.STATUS_ACTIVE} ` + filter;
    let beginBalance = [
      {
        beginBalance: 0
      }
    ];
    if (!!params.startDate)
      beginBalance = await this._prisma.$queryRaw(Prisma.raw(beginBalanceSql));
    let endBalanceSql =
      `
  SELECT IFNULL(SUM(str.stockCount),0) AS endBalance
  FROM \`StockTransaction\` str
  inner join \`Wallet\` wl on wl.id=str.walletId
  inner join \`UserMCSDAccount\` mcsd on mcsd.userId=wl.userId
  inner join \`Stock\` st on st.stockcode = st.stockcode
  WHERE str.dater<=${moment(params.endDate).format(
    'YYYY-MM-DD'
  )} AND str.status=${TransactionConst.STATUS_ACTIVE} ` + filter;
    let endBalance;
    if (!!params.endDate)
      endBalance = await this._prisma.$queryRaw(Prisma.raw(endBalanceSql));
    else
      endBalance = [
        {
          endBalance:
            resultList.length > 0
              ? parseFloat(resultList[0].income) -
                parseFloat(resultList[0].outcome) +
                parseFloat(resultList[0].expectedIncome) -
                parseFloat(resultList[0].expectedOutcome)
              : 0
        }
      ];
    if (resultList.length > 0) {
      return {
        ...resultList[0],
        ...beginBalance[0],
        ...endBalance[0],
        ...beginBalance[0]
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
