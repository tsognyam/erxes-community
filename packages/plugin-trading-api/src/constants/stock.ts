import BaseConst from './base';

export class StockConst extends BaseConst {
  static IPO = 0;
  static SO = 1;
}
export class StockTypeConst extends BaseConst {
  static SEC = 1;
  static COMPANY_BOND = 2;
  static GOV_BOND = 3;
  static PCKG = 4;
  static INT_SEC = 5;
  static INT_BOND = 6;
  static PRIVATE = 7;

  static getTypes = () => [
    StockTypeConst.SEC,
    StockTypeConst.COMPANY_BOND,
    StockTypeConst.GOV_BOND,
    StockTypeConst.PCKG,
    StockTypeConst.INT_SEC,
    StockTypeConst.INT_BOND
  ];
}

export class OrderTxnType extends BaseConst {
  static Buy = 1;
  static Sell = 2;
}

export class OrderType extends BaseConst {
  static MARKET = 1;
  static LIMIT = 2;
}

export class TxnSourceConst extends BaseConst {
  static Self = 1;
  static Broker = 2;
  static ContractNote = 3;
}

export class OrderCondition extends BaseConst {
  static Day = 0;
  static GTD = 6;
  static GTC = 1;
}

export class IpoType extends BaseConst {
  static FIXED_PRICE = 1;
  static BOOK_OFFERING = 2;
}

export class OrderStatus extends BaseConst {
  static STATUS_CANCEL = 0;
  static STATUS_NEW = 1;
  static STATUS_RECEIVE = 2;
  static STATUS_REVIEW = 3;
  static STATUS_PARTIALLY_FILLED = 4;
  static STATUS_FILLED = 5;
  static STATUS_REJECTED = 6;
  static STATUS_CALCULATED = 7;
  static STATUS_EXPIRED = 8;
  static STATUS_UPDATE = 9;
}
export class StockExchange extends BaseConst {
  static EXCHANGE_MSE = 1;
  static EXCHANGE_LOCAL = 0;
  static EXCHANGE_NYSE = 2;
}
