import BaseConst from './base';
export class WalletConst extends BaseConst {
  static readonly WALLET_TYPES = {
    NOMINAL: 1,
    NOMINAL_FEE: 2,
    USER: 3,
    ADMIN: 4,
    MCSD: 5
  };
  static STATUS_BLOCKED = 3;
}
export class TransactionConst extends BaseConst {
  static STATUS_SUCCESS = 1;
  static STATUS_CANCELED = 3;
  static STATUS_FAILED = 4;
  static STATUS_BLOCKED = 5;
  //transaction type
  static INCOME = 1;
  static OUTCOME = 2;
  static FEE_INCOME = 3;
  static FEE_OUTCOME = 4;
  //transaction order type
  static TYPE_UNDEFINED = 0;
  static TYPE_W2W = 1;
  static TYPE_BANK = 2;
  static TYPE_CHARGE = 3;
  static TYPE_WITHDRAW = 4;
  static TYPE_REGFEE = 5;
  static TYPE_ORDER = 6;

  static FEE_TYPE_SENDER = 0;
  static FEE_TYPE_RECEIVER = 1;
}
export class WithdrawConst extends BaseConst {
  static STATUS_SUCCESS = 1;
  static STATUS_REJECTED = 3;
  static STATUS_FAILED = 4;
  static STATUS_CONFIRMED = 5;
  static STATUS_NEW = 6;
  static STATUS_CANCELED = 7;

  static TYPE_WALLET = 1;
  static TYPE_MCSD_ACCOUNT = 2;
}
export class SettlementConst extends BaseConst {
  static TYPE_WALLET = 1;
  static TYPE_MSE_ACCOUNT = 2;

  static STATUS_NEW = 1;
  static STATUS_DONE = 3;
  static STATUS_FAILED = 4;
}
