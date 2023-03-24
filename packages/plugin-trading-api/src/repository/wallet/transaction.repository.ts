import BaseRepository from '../base.repository';
import { TransactionConst } from '../../constants/wallet';
import * as moment from 'moment';
import { Prisma } from '@prisma/client';
import { OrderTxnType } from '../../constants/stock';
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
    let sql =
      `
    SELECT tr.dater,tr.createdAt,tr.description,
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
    FROM \`Transaction\` tr where (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${TransactionConst.STATUS_PENDING})` +
      dateFilter +
      walletFilter +
      ' order by tr.dater,tr.createdAt';
    //     let sql =
    //       `SELECT
    //     tr.type,tr.dater,tr.createdAt,stock.stockname,
    //     stock.stockcode,stock.symbol,tr.amount+tr.feeAmount as totalAmount,
    //     case when o.txntype=${OrderTxnType.Buy} then "1"
    //     when o.txntype=${OrderTxnType.Sell} then "2"
    //     when tr.type=${TransactionConst.TYPE_CHARGE} then "3"
    //     when tr.type=${TransactionConst.TYPE_WITHDRAW} then "4" else "0" end as classfication,
    //     case
    //     when (tr.type=${TransactionConst.TYPE_CHARGE} and tr.status=${TransactionConst.STATUS_ACTIVE}) then tr.amount+tr.feeAmount
    //     when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Sell} and tr.status=${TransactionConst.STATUS_ACTIVE}) then tr.amount
    //     else 0 end as income,
    //     case when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Buy} and tr.status=${TransactionConst.STATUS_ACTIVE}) then tr.amount+tr.feeAmount else 0 end as outcome,
    //     case
    //     when (tr.type=${TransactionConst.TYPE_WITHDRAW} and tr.status=${TransactionConst.STATUS_PENDING}) then tr.amount+tr.feeAmount
    //     when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Sell} and tr.status=${TransactionConst.STATUS_PENDING}) then tr.amount
    //     else 0 end as expectedIncome,
    //     case when (tr.type=${TransactionConst.TYPE_W2W} and o.txntype=${OrderTxnType.Buy} and tr.status=${TransactionConst.STATUS_PENDING}) then tr.amount+tr.feeAmount else 0 end as expectedOutcome,
    //     tr.feeAmount,o.price
    //  FROM
    //      \`TransactionOrder\` tr
    //  left join \`Order\` o on o.tranOrderId=tr.id
    //  left join \`Stock\` stock on stock.stockcode=o.stockcode
    //  left join \`StockOrder\` stOrder on stOrder.id=o.stockOrderId
    //  where (tr.status=${TransactionConst.STATUS_ACTIVE} or tr.status=${TransactionConst.STATUS_PENDING})` +
    //       dateFilter +
    //       walletFilter;
    // fs.writeFile('Output.txt', sql, (err) => {

    //   // In case of a error throw err.
    //   if (err) throw err;
    // })
    let statementList = await this._prisma.$queryRaw(Prisma.raw(sql));
    console.log(statementList);
    let dataList = {
      total: statementList.length,
      count: statementList.length,
      values: statementList
    };
    return dataList;
  };
}
