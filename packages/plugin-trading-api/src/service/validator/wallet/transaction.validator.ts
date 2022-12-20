import { WalletConst, TransactionConst } from '../../../constants/wallet';
import TransactionOrderRepository from '../../../repository/wallet/transaction.order.repository';
import WalletValidator from './wallet.validator';

export class TransactionValidator extends WalletValidator {
  private transactionOrderRepository: TransactionOrderRepository = new TransactionOrderRepository();
  validateCreateParams = async (params: any) => {
    var { data } = this.validate(
      {
        senderWalletId: this._joi.number().required(),
        receiverWalletId: this._joi.number(),
        amount: this._joi.number().required(),
        feeAmount: this._joi.number().default(0),
        feeType: this._joi.number().default(TransactionConst.FEE_TYPE_SENDER),
        type: this._joi
          .any()
          .allow(
            TransactionConst.TYPE_W2W,
            TransactionConst.TYPE_CHARGE,
            TransactionConst.TYPE_WITHDRAW,
            TransactionConst.TYPE_ORDER
          )
          .required(),
        description: this._joi.string().default('')
      },
      params
    );

    var senderWallet = await this.checkWallet(
      {
        id: data.senderWalletId
      },
      { walletBalance: true }
    );
    var receiverWallet =
      data.receiverWalletId != undefined
        ? await this.checkWallet(
            { id: data.receiverWalletId },
            { walletBalance: true }
          )
        : undefined;
    return { senderWallet, receiverWallet, data };
  };
  validateW2W = async (params: any) => {
    var {
      senderWallet,
      receiverWallet,
      data
    } = await this.validateCreateParams(params);

    if (
      receiverWallet != undefined &&
      senderWallet.userId == receiverWallet.userId
    ) {
      throw new Error('User duplicated');
    }
    if (
      receiverWallet != undefined &&
      senderWallet.type + receiverWallet.type !== 4
    ) {
      throw new Error('Invalid wallet exception');
    }
    if (
      receiverWallet != undefined &&
      senderWallet.currencyCode != receiverWallet.currencyCode
    ) {
      throw new Error('Invalid wallet. Currency didnt match');
    }

    this.checkBalance(
      senderWallet,
      data.amount +
        (data.feeType == TransactionConst.FEE_TYPE_SENDER ? data.feeAmount : 0),
      false
    );
    if (receiverWallet != undefined) {
      this.checkBalance(
        receiverWallet,
        data.amount +
          (data.feeType == TransactionConst.FEE_TYPE_RECEIVER
            ? data.feeAmount
            : 0),
        true
      );
    }

    return { senderWallet, receiverWallet, data };
  };
  checkBalance = (
    wallet: any,
    amount: number,
    isIncome: boolean,
    oldAmount: number = 0
  ) => {
    var maxBalance = 1000000000;
    var minBalance = 0;
    if (wallet.type == WalletConst.NOMINAL) {
      minBalance = -1000000000;
    }

    var availableBalance =
      wallet.walletBalance.balance - wallet.walletBalance.holdBalance;

    if (isIncome === true) {
      availableBalance += amount;
    } else {
      availableBalance -= amount;
    }
    availableBalance += oldAmount;
    if (availableBalance > maxBalance || availableBalance < minBalance) {
      throw new Error('Balance not enough');
    }
  };
  validatorConfirm = async params => {
    var { data } = this.validate(
      {
        orderId: this._joi.number().required(),
        confirm: this._joi
          .number()
          .valid(0, 1)
          .required()
      },
      params
    );

    var order = await this.transactionOrderRepository.findUnique(
      {
        id: data.orderId
      },
      {
        transactions: true,
        mainOrder: {
          include: {
            stock: true
          }
        }
      }
    );
    if (order.status !== TransactionConst.STATUS_PENDING) {
      throw new Error('Transaction already confirmed');
    }

    return order;
  };

  validateStatement = async (params: any) => {
    var { data } = this.validate(
      {
        walletId: this._joi.number().required(),
        userId: this._joi.number().required(),
        startDate: this._joi.date().required(),
        endDate: this._joi.date().required(),
        skip: this._joi.number(),
        take: this._joi.number()
      },
      params
    );
    this.checkWallet(
      {
        id: data.walletId,
        status: WalletConst.STATUS_ACTIVE,
        userId: data.userId
      },
      {
        walletBalance: true
      }
    );

    return data;
  };

  validateSettlement = async (params: any) => {
    var { data } = this.validate(
      {
        walletId: this._joi.number().required(),
        startDate: this._joi.date().required(),
        endDate: this._joi.date().required()
      },
      params
    );
    this.checkWallet(
      {
        id: data.walletId,
        status: WalletConst.STATUS_ACTIVE,
        userId: data.userId
      },
      {
        walletBalance: true
      }
    );

    return data;
  };

  validateParticipate = async (params: any) => {
    var { data } = this.validate(
      {
        orderId: this._joi.number().required(),
        feeAmount: this._joi.number().required(),
        amount: this._joi.number().required()
      },
      params
    );
    var order = await this.transactionOrderRepository.findUnique(
      {
        id: data.orderId
      },
      {
        transactions: true
      }
    );
    if (order.status != TransactionConst.STATUS_PENDING) {
      throw new Error('Transaction already confirmed');
    }
    order.amount = parseFloat(order.amount.toFixed(4));
    order.feeAmount = parseFloat(order.feeAmount.toFixed(4));
    data.amount = parseFloat(data.amount.toFixed(4));
    data.feeAmount = parseFloat(data.feeAmount.toFixed(4));
    if (
      order.amount <= data.amount ||
      (order.feeAmount <= data.feeAmount && order.feeAmount > 0)
    ) {
      throw new Error('Invalid participate amount');
    }
    return { data, order };
  };
  validateReCreateTransaction = async (params: any) => {
    var { data } = this.validate(
      {
        orderId: this._joi.number().required(),
        donedate: this._joi.date().required(),
        donecnt: this._joi.number().required(),
        doneprice: this._joi.number().required()
      },
      params
    );
    return data;
  };
}
