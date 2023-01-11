import { TransactionConst } from '../../../constants/wallet';
import StockOrderRepository from '../../../repository/wallet/stock.transaction.order.repository';
import BaseValidator from '../base.validator';
import StockWalletValidator from './stock.wallet.validator';
import WalletValidator from './wallet.validator';
import { WalletConst } from '../../../constants/wallet';
import { ErrorCode, CustomException } from '../../../exception/error-code';

export default class StockTransactionValidator extends BaseValidator {
  private stockTransactionOrderRepository: StockOrderRepository = new StockOrderRepository();
  private stockWalletValidator: StockWalletValidator = new StockWalletValidator();
  private walletValidator: WalletValidator = new WalletValidator();
  checkOrderId = async (orderId, select: any = undefined) => {
    var transactionOrder = await this.stockTransactionOrderRepository.findUnique(
      { id: orderId },
      select
    );
    if (!transactionOrder) {
      CustomException(ErrorCode.TransactionOrderNotFoundException);
    }
    return transactionOrder;
  };

  validateCreateParams = async params => {
    var { error, data } = this.validate(
      {
        senderWalletId: this._joi.number(),
        receiverWalletId: this._joi.number(),
        stockCount: this._joi.number().required(),
        stockCode: this._joi.number().required(),
        type: this._joi.number().default(TransactionConst.TYPE_W2W)
      },
      params
    );

    var senderBalance =
      data.senderWalletId != undefined
        ? await this.stockWalletValidator.validateBalanceWithWallet({
            walletId: data.senderWalletId,
            stockCode: data.stockCode
          })
        : undefined;
    var receiverBalance =
      data.receiverWalletId != undefined
        ? await this.stockWalletValidator.validateBalanceWithWallet({
            walletId: data.receiverWalletId,
            stockCode: data.stockCode
          })
        : undefined;
    if (senderBalance == undefined && receiverBalance == undefined) {
      CustomException(ErrorCode.InvalidParamException);
    }
    console.log('senderBalance', {
      senderBalance,
      receiverBalance
    });
    return { data, senderBalance, receiverBalance };
  };
  validateStatement = async params => {
    var { error, data } = this.validate(
      {
        walletId: this._joi.number().required(),
        // userId: this._joi.number().required(),
        startDate: this._joi.date().required(),
        endDate: this._joi.date().required(),
        skip: this._joi.number(),
        take: this._joi.number()
      },
      params
    );

    // this.walletValidator.checkWallet({
    //   id: data.walletId,
    //   userId: data.userId
    // });

    return data;
  };
  validateW2W = async params => {
    var {
      data,
      senderBalance,
      receiverBalance
    } = await this.validateCreateParams(params);

    if (senderBalance != undefined && receiverBalance != undefined) {
      if (senderBalance.wallet.userId == receiverBalance.wallet.userId) {
        CustomException(ErrorCode.DuplicateUserException);
      }
      if (senderBalance.wallet.type + receiverBalance.wallet.type == 6) {
        CustomException(ErrorCode.InvalidWalletException);
      }
      if (
        senderBalance.wallet.currencyCode != receiverBalance.wallet.currencyCode
      ) {
        CustomException(ErrorCode.WalletCurrencyException);
      }
    }
    if (
      senderBalance != undefined &&
      senderBalance.wallet.type != WalletConst.NOMINAL
    )
      this.checkBalance(
        senderBalance.wallet,
        senderBalance,
        data.stockCount,
        false
      );
    if (
      receiverBalance != undefined &&
      receiverBalance.wallet.type != WalletConst.NOMINAL
    )
      this.checkBalance(
        receiverBalance.wallet,
        receiverBalance,
        data.stockCount,
        true
      );

    return { senderBalance, receiverBalance, data };
  };

  checkBalance = (wallet, walletBalance, amount, isIncome, oldAmount = 0) => {
    var minBalance = 0;

    var availableBalance = walletBalance.balance - walletBalance.holdBalance;

    if (isIncome === true) {
      availableBalance += amount;
    } else {
      availableBalance -= amount;
    }
    availableBalance += oldAmount;
    if (availableBalance < minBalance) {
      CustomException(ErrorCode.WalletStockBalanceException);
    }
  };

  validatorConfirm = async params => {
    var { error, data } = this.validate(
      {
        orderId: this._joi.number().required(),
        confirm: this._joi
          .number()
          .valid(0, 1)
          .required()
      },
      params
    );

    var order = await this.checkOrderId(data.orderId, {
      stockTransactions: true
    });
    if (order.status !== TransactionConst.STATUS_PENDING) {
      CustomException(ErrorCode.TransactionAlreadyConfirmedException);
    }

    return order;
  };

  validateParticipate = async params => {
    var { error, data } = this.validate(
      {
        orderId: this._joi.number().required(),
        stockCount: this._joi.number().required()
      },
      params
    );

    var order = await this.checkOrderId(data.orderId, {
      stockTransactions: true
    });

    if (order.status != TransactionConst.STATUS_PENDING) {
      CustomException(ErrorCode.TransactionAlreadyConfirmedException);
    }
    if (order.stockCount <= data.stockCount) {
      CustomException(ErrorCode.InvalidParticipateAmountException);
    }

    return { data, order };
  };
}
