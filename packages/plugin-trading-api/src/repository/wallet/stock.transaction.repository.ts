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
        " and tr.dater between '" +
        moment(params.startDate).format('YYYY-MM-DD') +
        "' and '" +
        moment(params.endDate).format('YYYY-MM-DD') +
        "'";
    }
    let walletFilter = '';
    if (params.walletId) {
      walletFilter = ` and tr.walletId=${params.walletId} `;
    }
    let paginationFilter = ` limit ` + params.take + ` offset ` + params.skip;
    let sql =
      `
      SELECT tr.dater,tr.createdAt,tr.description,tr.walletId,tr.type,
      case 
      when (str.type=1 and str.status=1) then str.stockCount
      when (str.type=3 and str.status=1) then str.stockCount
      else 0 end as income,
      case when (str.type=2  and str.status=1) then str.stockCount
      when (str.type=4 and str.status=1) then str.stockCount
    else 0 end as outcome,
    case  
      when (str.type=1 and str.status=2) then str.stockCount
      when (str.type=3 and str.status=2) then str.stockCount
      else 0 end as expectedIncome,
      case 
      when (str.type=2 and str.status=2) then str.stockCount 
      when (str.type=4 and str.status=2) then str.stockCount 
      else 0 end as expectedOutcome,
      st.stockcode,st.stockname,st.symbol,str.fee,str.price
      FROM \`Transaction\` tr 
      inner join \`Wallet\` wl on wl.id=tr.walletId 
      where wl.type!=${WalletConst.NOMINAL} and wl.type!=${WalletConst.NOMINAL_FEE} and (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${TransactionConst.STATUS_PENDING})` +
      dateFilter +
      walletFilter +
      ' order by tr.createdAt,tr.dater' +
      paginationFilter;
    let statementList = await this._prisma.$queryRaw(Prisma.raw(sql));
    let beginBalanceSql =
      `
      SELECT SUM(tr.stockCount) AS stockCount,tr.stockCode,tr.walletId
      FROM \`StockTransaction\` tr
      WHERE tr.dater<${params.startDate} AND tr.status=${TransactionConst.STATUS_ACTIVE} ` +
      walletFilter +
      `
      GROUP BY tr.walletId, tr.stockCode
      `;
    let beginBalance = await this._prisma.$queryRaw(
      Prisma.raw(beginBalanceSql)
    );
    let endBalance = await this._prisma
      .$queryRaw`SELECT IFNULL(sum(ss.stockCount),0) AS stockCount, ss.walletId, ss.stockCode FROM 
        (SELECT IFNULL(SUM(tr.stockCount),0) AS stockCount,tr.walletId, tr.stockCode FROM \`StockTransaction\` tr 
        WHERE tr.walletId=${params.walletId} AND tr.dater<${params.startDate} AND tr.status=1 Group BY tr.walletId, tr.stockCode 
        UNION all 
        SELECT IFNULL(SUM(tr.stockCount),0) AS stockCount,tr.walletId,tr.stockCode FROM \`StockTransaction\` tr 
        WHERE tr.walletId=${params.walletId} AND tr.dater BETWEEN ${params.startDate} AND ${params.endDate} AND tr.status=${TransactionConst.STATUS_ACTIVE} Group BY tr.walletId, tr.stockCode ) ss group by ss.walletId, ss.stockCode;`;
    let dataList = {
      total: statementList.length,
      count: statementList.length,
      values: statementList,
      beginBalance,
      endBalance
    };
    return dataList;
  };
}
